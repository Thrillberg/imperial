package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/websocket"
)

var connections = map[UserId]*Conn{}
var users = map[UserId]UserName{}
var gameLog = []Action{}
var upgrader = websocket.Upgrader{CheckOrigin: func(*http.Request) bool { return true }}

func init() {
	log.SetFlags(log.Lshortfile | log.Ldate | log.Ltime)
}

func main() {
	var addr = ":80"
	if len(os.Args) == 2 {
		addr = os.Args[1]
	}
	http.HandleFunc("/health", handleHealth)
	http.HandleFunc("/ws", handleWebsocket)
	log.Println("serving websockets at", addr)
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Println("connection error", err)
	}
}

// UserId uniquely identifies a client. We would like to use an
// integer here, but JSON does not support integers. Instead, we
// generate a pseudorandom, base64-encoded string.
type UserId string

type UserName string

// NewUserId generates a pseudorandom, base64-encoded UserId.
func NewUserId() (UserId, error) {
	// go doc math/rand.Read
	//
	// > It always returns len(p) and a nil error.
	buf := make([]byte, 8)
	rand.Read(buf)

	builder := strings.Builder{}
	encoder := base64.NewEncoder(base64.StdEncoding, &builder)
	if _, err := encoder.Write(buf); err != nil {
		return UserId(""), err
	}
	return UserId(builder.String()), nil
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
	// KindRegisterUser is received from clients when they register
	// a name.
	KindRegisterUser = Kind("registerUser")
	// KindUserRegistered is sent to clients when a user register a
	// name.
	KindUserRegistered = Kind("userRegistered")
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
func (c *Conn) SetId(id UserId) error {
	return c.write(&Envelope{
		Kind: KindSetId,
		Data: map[string]string{
			"id": string(id),
		},
	})
}

// UserRegistered sends a KindUserRegistered message to the client.
func (c *Conn) UserRegistered(users map[UserId]UserName) error {
	var usersSlice = []map[string]string{}
	for key, val := range users {
		usersSlice = append(usersSlice, map[string]string{"id": string(key), "name": string(val)})
	}
	usersList, _ := json.Marshal(usersSlice)

	return c.write(&Envelope{
		Kind: KindUserRegistered,
		Data: map[string]string{
			"users": string(usersList),
		},
	})
}

// UpdatePlayers sends a KindUpdatePlayers message to the client.
func (c *Conn) UpdatePlayers(players map[UserId]UserName) error {
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
func (c *Conn) StartGame(players map[UserId]UserName) error {
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
	c.Register(KindRegisterUser, onRegisterUser)
	c.Register(KindTick, onTick)

	id, err := NewUserId()
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
	oldId := UserId(data["oldId"])
	newId := UserId(data["newId"])
	log.Printf("%s: %s -> %s\n", KindUpdateId, oldId, newId)
	connections[newId] = c
	delete(connections, oldId)

	if val, ok := users[oldId]; ok {
		users[newId] = val
		delete(users, oldId)
	}

	for _, conn := range connections {
		if err := conn.UserRegistered(users); err != nil {
			log.Println(users, "UserRegistered")
			return nil
		}
		if len(users) == 2 {
			if err := conn.UpdateGameLog(gameLog); err != nil {
				log.Println(gameLog, "UpdateGameLog")
				return nil
			}
		}
	}

	return nil
}

func onRegisterUser(c *Conn, data Data) error {
	if err := data.Validate("name", "id"); err != nil {
		return err
	}
	name := UserName(data["name"])
	id := UserId(data["id"])
	log.Printf("%s: %s(%s)\n", KindRegisterUser, name, id)
	users[id] = name

	for _, conn := range connections {
		if err := conn.UserRegistered(users); err != nil {
			log.Println(users, "UserRegistered")
			return nil
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
