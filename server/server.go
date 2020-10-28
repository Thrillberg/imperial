package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/websocket"
)

var connections = map[PlayerId]*Conn{}
var players = map[PlayerId]PlayerName{}
var games = map[GameId]*Game{}

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

type GameId string

type Game struct {
  Log     []Action `json:"log"`
  Players map[PlayerId]PlayerName `json:"players"`
  Host    PlayerName `json:"host"`
}

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

// NewGameId generates a pseudorandom, base64-encoded GameId.
func NewGameId() (GameId, error) {
	// go doc math/rand.Read
	//
	// > It always returns len(p) and a nil error.
	buf := make([]byte, 8)
	rand.Read(buf)

	builder := strings.Builder{}
	encoder := base64.NewEncoder(base64.StdEncoding, &builder)
	if _, err := encoder.Write(buf); err != nil {
		return GameId(""), err
	}
	return GameId(builder.String()), nil
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
	// KindOpenGame is send to clients when a player indicates they want to play
	// a game.
	KindOpenGame = Kind("openGame")
	// KindUpdatePlayers is sent to clients when a player's
	// name is updated.
	//KindUpdatePlayers = Kind("updatePlayers")
	// KindStartGame is sent to clients when a game starts.
	KindStartGame = Kind("startGame")
	// KindTick is received from clients when they register a
	// new entry in the game log.
	KindTick = Kind("tick")
	// KindUpdateGameLog is sent to clients when there is a new
	// entry in the game log.
	KindUpdateGameLog = Kind("updateGameLog")
	// KindUpdateGamesList is sent to clients when a client re-connects.
	KindUpdateGamesList = Kind("updateGamesList")
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

// OpenGame sends a KindOpenGame message to the client.
func (c *Conn) OpenGame(gameId GameId, host PlayerName) error {
	return c.write(&Envelope{
		Kind: KindOpenGame,
		Data: map[string]string{
			"gameId": string(gameId),
			"host":   string(host),
		},
	})
}

// UpdatePlayers sends a KindUpdatePlayers message to the client.
//func (c *Conn) UpdatePlayers(players map[PlayerId]PlayerName) error {
//	var playersSlice = []map[string]string{}
//	for key, val := range players {
//		playersSlice = append(playersSlice, map[string]string{"id": string(key), "name": string(val)})
//	}
//	playersList, _ := json.Marshal(playersSlice)

//	return c.write(&Envelope{
//		Kind: KindUpdatePlayers,
//		Data: map[string]string{
//			"players": string(playersList),
//		},
//	})
//}

// StartGame sends a KindStartGame message to the client.
func (c *Conn) StartGame(gameId GameId, players map[PlayerId]PlayerName) error {
	var playersSlice = []map[string]string{}
	for key, val := range players {
		playersSlice = append(playersSlice, map[string]string{"id": string(key), "name": string(val)})
	}
	playersList, _ := json.Marshal(playersSlice)

	return c.write(&Envelope{
		Kind: KindStartGame,
		Data: map[string]string{
			"gameId":  string(gameId),
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

// UpdateGamesList sends a KindUpdateGamesList message to the client.
func (c *Conn) UpdateGamesList() error {
	gamesList, _ := json.Marshal(games)

	return c.write(&Envelope{
		Kind: KindUpdateGamesList,
		Data: map[string]string{
			"games": string(gamesList),
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
	c.Register(KindOpenGame, onOpenGame)
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

	// Update a broken connection.
	oldId := PlayerId(data["oldId"])
	newId := PlayerId(data["newId"])
	log.Printf("%s: %s -> %s\n", KindUpdateId, oldId, newId)
	connections[newId] = c
	delete(connections, oldId)

  // Update id in player's games.
  for _, game := range games {
    for playerId, playerName := range game.Players {
      if (playerId == oldId) {
        game.Players[newId] = playerName
        delete(game.Players, oldId)
      }
    }
  }

	// Inform the connection of all games.
	if err := c.UpdateGamesList(); err != nil {
		log.Println(games, "UpdateGamesList")
		return nil
	}

	return nil
}

func onOpenGame(c *Conn, data Data) error {
	if err := data.Validate("name", "id"); err != nil {
		return err
	}
	hostName := PlayerName(data["name"])
	hostId := PlayerId(data["id"])
	players := map[PlayerId]PlayerName{hostId: hostName}
	log.Printf("%s: %s(%s)\n", KindOpenGame, hostName, hostId)

	gameId, err := NewGameId()
	if err != nil {
		log.Println("NewGameId", err)
		return (err)
	}
	game := &Game{[]Action{}, players, hostName}
	games[gameId] = game

	if err := c.UpdateGamesList(); err != nil {
		log.Println(games, "UpdateGamesList")
		return nil
	}

	return nil
}

func onTick(c *Conn, data Data) error {
	var action Action
	actionErr := json.Unmarshal([]byte(data["action"]), &action)
	if actionErr != nil {
		fmt.Println("action error:", actionErr)
	}

	var gameId GameId
	gameIdErr := json.Unmarshal([]byte(data["gameId"]), &gameId)
	if gameIdErr != nil {
		fmt.Println("gameId error:", gameIdErr)
	}

	fmt.Println("beforeGameylawg!", games)
	var game = games[gameId]
	fmt.Println("gameylawg!", game)
	//var gameLog = append(game.Log, action)

	games[gameId] = &Game{gameLog, players, game.Host}

	log.Printf("%s: %s", KindTick, games[gameId])

	for _, conn := range connections {
		if err := conn.UpdateGameLog(games[gameId].Log); err != nil {
			log.Println(games[gameId].Log, "UpdateGameLog")
			return nil
		}
	}

	return nil
}
