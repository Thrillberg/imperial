package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var connections = map[UserId]*Conn{}
var users = map[UserId]UserName{}
var games = map[GameId]*Game{}
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

type GameId string

type Game struct {
	Log     []Action            `json:"log"`
	Players map[UserId]UserName `json:"players"`
	Host    UserName            `json:"host"`
}

// NewUserId generates a string from a UUID.
func NewUserId() (UserId, error) {
	return UserId(uuid.New().String()), nil
}

// NewGameId generates a string from a UUID.
func NewGameId() (GameId, error) {
	return GameId(uuid.New().String()), nil
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
	// KindUserRegistered is sent to clients when a user registers a
	// name.
	KindUserRegistered = Kind("userRegistered")
	// KindOpenGame is received from clients when they open a new game.
	KindOpenGame = Kind("openGame")
	// KindGameOpened is sent to the clients when a user opens a new game.
	KindGameOpened = Kind("gameOpened")
	// KindJoinGame is received from clients when they join a game.
	KindJoinGame = Kind("joinGame")
	// KindGameStarted is sent to the clients when a second user joins
	// a game and the game starts.
	KindGameStarted = Kind("gameStarted")
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

// UpdateState sends userId, registered users, and open games to the client.
func (c *Conn) UpdateState(id UserId) error {
	if err := c.SetId(id); err != nil {
		log.Println(id, "SetId")
		return nil
	}
	if err := c.UserRegistered(users); err != nil {
		log.Println(users, "UserRegistered")
		return nil
	}
	if err := c.GameOpened(games); err != nil {
		log.Println(games, "GameOpened")
		return nil
	}

	return nil
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

// GameOpened sends a KindGameOpened message to the client.
func (c *Conn) GameOpened(games map[GameId]*Game) error {
	var gamesSlice = []map[string]string{}
	for key, val := range games {
		parsedVal, _ := json.Marshal(val)
		gamesSlice = append(gamesSlice, map[string]string{"id": string(key), "game": string(parsedVal)})
	}
	gamesList, _ := json.Marshal(gamesSlice)

	return c.write(&Envelope{
		Kind: KindGameOpened,
		Data: map[string]string{
			"games": string(gamesList),
		},
	})
}

// GameStarted sends a KindGameStarted message to the client.
func (c *Conn) GameStarted(gameId GameId) error {
	game := games[gameId]
	parsedGame, _ := json.Marshal(game)

	return c.write(&Envelope{
		Kind: KindGameStarted,
		Data: map[string]string{
			"game": string(parsedGame),
			"id":   string(gameId),
		},
	})

	return nil
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
func (c *Conn) UpdateGameLog(gameId GameId, log []Action) error {
	logList, _ := json.Marshal(log)

	return c.write(&Envelope{
		Kind: KindUpdateGameLog,
		Data: map[string]string{
			"gameId": string(gameId),
			"log":    string(logList),
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
	var responseHeader http.Header
	userId := getUserIdFromCookie(r)

	if c := connections[userId]; c == nil {
		responseHeader = setUserIdToCookie(w)
	}

	ws, err := upgrader.Upgrade(w, r, responseHeader)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "error: %s", err)
		log.Println("establishing websocket connection", err)
		return
	}
	c := NewConn(ws)
	c.Register(KindUpdateId, onUpdateId)
	c.Register(KindRegisterUser, onRegisterUser)
	c.Register(KindOpenGame, onOpenGame)
	c.Register(KindJoinGame, onJoinGame)
	c.Register(KindTick, onTick)

	if err := c.UpdateState(userId); err != nil {
		log.Println(userId, "UpdateState")
		return
	}

	log.Println(userId, "storing connection")
	connections[userId] = c

	c.Listen()
}

func getUserIdFromCookie(r *http.Request) UserId {
	cookie := r.Header.Get("Cookie")
	parsedCookie, cookieErr := url.ParseQuery(cookie)
	if cookieErr != nil {
		log.Println("Cookie", cookieErr)
	}

	return UserId(parsedCookie.Get("userId"))
}

func setUserIdToCookie(w http.ResponseWriter) http.Header {
	newUserId, err := NewUserId()
	if err != nil {
		log.Println("NewUserId", err)
		return http.Header{}
	}
	newCookie := http.Cookie{Name: "userId", Value: string(newUserId), SameSite: 2}
	http.SetCookie(w, &newCookie)

	return w.Header()
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

func onOpenGame(c *Conn, data Data) error {
	if err := data.Validate("host", "id"); err != nil {
		return err
	}
	name := UserName(data["host"])
	id := UserId(data["id"])
	log.Printf("%s: %s(%s) is opening a game\n", KindOpenGame, name, id)
	gameId, err := NewGameId()
	if err != nil {
		log.Println("NewGameId", err)
		return nil
	}

	games[gameId] = &Game{[]Action{}, map[UserId]UserName{id: name}, name}

	for _, conn := range connections {
		if err := conn.GameOpened(games); err != nil {
			return nil
		}
	}

	return nil
}

func onJoinGame(c *Conn, data Data) error {
	if err := data.Validate("userName", "userId", "gameId"); err != nil {
		return err
	}
	userName := UserName(data["userName"])
	userId := UserId(data["userId"])
	gameId := GameId(data["gameId"])
	log.Printf("%s: %s(%s) is joining a game(%s)\n", KindJoinGame, userName, userId, gameId)

	games[gameId].Players[userId] = userName

	for _, conn := range connections {
		if err := conn.GameStarted(gameId); err != nil {
			return nil
		}
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

	games[gameId].Log = append(games[gameId].Log, action)

	log.Printf("%s: %s", KindTick, games[gameId].Log)

	for _, conn := range connections {
		if err := conn.UpdateGameLog(gameId, games[gameId].Log); err != nil {
			log.Println(games[gameId].Log, "UpdateGameLog")
			return nil
		}
	}

	return nil
}
