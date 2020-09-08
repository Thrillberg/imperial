package main

import (
	"encoding/base64"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

const addr = "localhost:8080"

var connections = map[PlayerId]*Conn{}
var players = map[PlayerId]bool{}
var gameLog = []Action{}
var upgrader = websocket.Upgrader{CheckOrigin: func(*http.Request) bool { return true }}

func init() {
	log.SetFlags(log.Lshortfile | log.Ldate | log.Ltime)
}

func main() {
	http.HandleFunc("/ws", handleWebsocket)
	log.Println("serving websockets at", addr)
	http.ListenAndServe(addr, nil)
}

// PlayerId uniquely identifies a client. We would like to use an
// integer here, but JSON does not support integers. Instead, we
// generate a pseudorandom, base64-encoded string.
type PlayerId string

// NewPlayerId generates a pseudorandom, base64-encoded PlayerId.
func NewPlayerId() (PlayerId, error) {
	// go doc math/rand.Read
	//
	// > It always returns len(p) and a nil error.
	buf := make([]byte, 8)
	rand.Read(buf)

	builder := strings.Builder{}
	encoder := base64.NewEncoder(base64.StdEncoding, &builder)
	if _, err := encoder.Write(buf); err != nil {
		return PlayerId(""), err
	}
	return PlayerId(builder.String()), nil
}

type Action interface{}

// Envelope represents the format of a WebSockets message.
type Envelope struct {
	Kind Kind `json:"kind"`
	Data Data `json:"data"`
}

type Kind string

type Data map[string]string

// Validate checks a Data map for presence of the given keys.
func (d Data) Validate(key ...string) error {
	missing := []string{}
	for _, k := range key {
		if _, ok := d[k]; !ok {
			missing = append(missing, k)
		}
	}
	if len(missing) > 0 {
		return fmt.Errorf("missing keys: %s (%v)", strings.Join(missing, ", "), d)
	}
	return nil
}

const (
	// KindSetId is sent to clients when a connection is first
	// established.
	KindSetId = Kind("setId")
	// KindUpdateId is received from clients when they are
	// restarting from a broken connection.
	KindUpdateId = Kind("updateId")
)

// Conn wraps a websocket.Conn with convenience methods and message
// receipt handlers.
type Conn struct {
	conn     *websocket.Conn
	handlers map[Kind]func(*Conn, Data) error
}

// NewConn allocates and initializes a new Conn.
func NewConn(ws *websocket.Conn) *Conn {
	return &Conn{
		conn:     ws,
		handlers: map[Kind]func(*Conn, Data) error{},
	}
}

// write wraps websocket.Conn.WriteJSON
func (c *Conn) write(v interface{}) error {
	return c.conn.WriteJSON(v)
}

// SetId sends a KindSetId message to the client.
func (c *Conn) SetId(id PlayerId) error {
	return c.write(&Envelope{
		Kind: KindSetId,
		Data: map[string]string{
			"id": string(id),
		},
	})
}

// Register is the way to listen for messages from the client. Only
// one handler is allowed per Kind. Old handlers will be silently
// overwritten by new ones.
func (c *Conn) Register(k Kind, h func(*Conn, Data) error) {
	c.handlers[k] = h
}

// Listen starts an infinite loop of reading messages from the client.
func (c *Conn) Listen() {
	for {
		e := Envelope{}
		if err := c.conn.ReadJSON(&e); err != nil {
			log.Println("read error", err)
			return
		}
		h, ok := c.handlers[e.Kind]
		if !ok {
			log.Println("skipping handler", c, e.Kind)
			continue
		}
		log.Println("handling", e.Kind, h(c, e.Data))
	}
}

func handleWebsocket(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "error: %s", err)
		log.Println("establishing websocket connection", err)
		return
	}
	c := NewConn(ws)
	c.Register(KindUpdateId, onUpdateId)

	id, err := NewPlayerId()
	if err != nil {
		log.Println("NewPlayerId", err)
		return
	}
	if err := c.SetId(id); err != nil {
		log.Println(id, "SetId")
		return
	}

	log.Println(id, "storing connection")
	connections[id] = c

	c.Listen()
}

func onUpdateId(c *Conn, data Data) error {
	if err := data.Validate("oldId", "newId"); err != nil {
		return err
	}
	oldId := PlayerId(data["oldId"])
	newId := PlayerId(data["newId"])
	log.Printf("%s: %s -> %s\n", KindUpdateId, oldId, newId)
	connections[newId] = c
	delete(connections, oldId)
	return nil
}
