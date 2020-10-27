package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

const addr = ":8080"

var connections = map[PlayerId]*Conn{}
var players = map[PlayerId]PlayerName{}
var gameLog = []Action{}
var availableActions = []Action{}
var rawAvailableActions = []string{}
var upgrader = websocket.Upgrader{CheckOrigin: func(*http.Request) bool { return true }}

func init() {
	log.SetFlags(log.Lshortfile | log.Ldate | log.Ltime)
}

func main() {
	http.HandleFunc("/health", handleHealth)
	http.HandleFunc("/ws", handleWebsocket)
	log.Println("serving websockets at", addr)
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Println("connection error", err)
	}
}

// PlayerId uniquely identifies a client. We would like to use an
// integer here, but JSON does not support integers. Instead, we
// generate a pseudorandom, base64-encoded string.
type PlayerId string

type PlayerName string

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
	// KindUpdateName is received from the clients when they
	// register a player's name.
	KindUpdateName = Kind("updateName")
	// KindUpdatePlayers is sent to clients when a player's
	// name is updated.
	KindUpdatePlayers = Kind("updatePlayers")
	// KindStartGame is sent to clients when a game starts.
	KindStartGame = Kind("startGame")
	// KindTick is received from clients when they register a
	// new entry in the game log.
	KindTick = Kind("tick")
	// KindUpdateGameLog is sent to clients when there is a new
	// entry in the game log.
	KindUpdateGameLog = Kind("updateGameLog")
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

// UpdatePlayers sends a KindUpdatePlayers message to the client.
func (c *Conn) UpdatePlayers(players map[PlayerId]PlayerName) error {
	var playersSlice = []map[string]string{}
	for key, val := range players {
		playersSlice = append(playersSlice, map[string]string{"id": string(key), "name": string(val)})
	}
	playersList, _ := json.Marshal(playersSlice)

	return c.write(&Envelope{
		Kind: KindUpdatePlayers,
		Data: map[string]string{
			"players": string(playersList),
		},
	})
}

// StartGame sends a KindStartGame message to the client.
func (c *Conn) StartGame(players map[PlayerId]PlayerName) error {
	var playersSlice = []map[string]string{}
	for key, val := range players {
		playersSlice = append(playersSlice, map[string]string{"id": string(key), "name": string(val)})
	}
	playersList, _ := json.Marshal(playersSlice)

	return c.write(&Envelope{
		Kind: KindStartGame,
		Data: map[string]string{
			"players": string(playersList),
		},
	})
}

// UpdateGameLog sends a KindUpdateGameLog message to the client.
func (c *Conn) UpdateGameLog(gameLog []Action) error {
	gameLogList, _ := json.Marshal(gameLog)

	return c.write(&Envelope{
		Kind: KindUpdateGameLog,
		Data: map[string]string{
			"gameLog": string(gameLogList),
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

func handleHealth(w http.ResponseWriter, r *http.Request) {
	log.Println("health ping", w)
	io.WriteString(w, "Healthy!")
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
	c.Register(KindUpdateName, onUpdateName)
	c.Register(KindTick, onTick)

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

	if val, ok := players[oldId]; ok {
		players[newId] = val
		delete(players, oldId)
	}

	for _, conn := range connections {
		if err := conn.UpdatePlayers(players); err != nil {
			log.Println(players, "UpdatePlayers")
			return nil
		}
		if len(players) == 2 {
			if err := conn.UpdateGameLog(gameLog); err != nil {
				log.Println(gameLog, "UpdateGameLog")
				return nil
			}
		}
	}

	return nil
}

func onUpdateName(c *Conn, data Data) error {
	if err := data.Validate("name", "id"); err != nil {
		return err
	}
	name := PlayerName(data["name"])
	id := PlayerId(data["id"])
	log.Printf("%s: %s(%s)\n", KindUpdateName, name, id)
	players[id] = name

	for _, conn := range connections {
		if len(players) == 2 {
			if err := conn.StartGame(players); err != nil {
				log.Println(players, "StartGame")
				return nil
			}
		} else {
			if err := conn.UpdatePlayers(players); err != nil {
				log.Println(players, "UpdatePlayers")
				return nil
			}
		}
	}

	return nil
}

func onTick(c *Conn, data Data) error {
	var action Action
	err := json.Unmarshal([]byte(data["action"]), &action)
	if err != nil {
		fmt.Println("action error:", err)
	}

	gameLog = append(gameLog, action)

	log.Printf("%s: %s", KindTick, gameLog)

	for _, conn := range connections {
		if err := conn.UpdateGameLog(gameLog); err != nil {
			log.Println(gameLog, "UpdateGameLog")
			return nil
		}
	}

	return nil
}
