package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type globalState struct {
	*sync.Mutex
	connections map[UserId]*Conn
	users       map[UserId]UserName
	games       map[GameId]*Game
}

// state is this server's global state. It is coarsely locked by
// the embedded mutex.
var state = globalState{
	Mutex:       &sync.Mutex{},
	connections: map[UserId]*Conn{},
	users:       map[UserId]UserName{},
	games:       map[GameId]*Game{},
}

var upgrader = websocket.Upgrader{CheckOrigin: func(*http.Request) bool { return true }}

const cookiename = "userId"

func init() {
	log.SetFlags(log.Lshortfile | log.Ldate | log.Ltime)
}

func main() {
	var addr = ":80"
	if len(os.Args) == 2 {
		addr = ":8080"
	}
	http.HandleFunc("/health", handleHealth)
	http.HandleFunc("/ws", handleWebsocket)
	log.Println("serving websockets at", addr)
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Println("connection error", err)
	}
}

// UserId uniquely identifies a client and is a UUID stored in a cookie
// on the browser.
type UserId string

type UserName string

type GameId string

type Game struct {
	Log     []Action            `json:"log"`
	Players map[UserId]UserName `json:"players"`
	Host    UserName            `json:"host"`
}

// NewUserId generates a string from a UUID.
func NewUserId() UserId {
	return UserId(uuid.New().String())
}

// NewGameId generates a string from a UUID.
func NewGameId() GameId {
	return GameId(uuid.New().String())
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
	userId   UserId
	purple   *purple
}

// NewConn allocates and initializes a new Conn.
func NewConn(ws *websocket.Conn, userId UserId) *Conn {
	return &Conn{
		conn:     ws,
		handlers: map[Kind]func(*Conn, Data) error{},
		userId:   userId,
		purple: &purple{
			registerUser:   make(chan UserName),
			userRegistered: make(chan map[UserId]UserName, 1),
			openGame:       make(chan UserName),
			gameOpened:     make(chan map[GameId]*Game, 1),
			joinGame:       make(chan JoinGamePayload),
		},
	}
}

type purple struct {
	registerUser   chan UserName
	userRegistered chan map[UserId]UserName
	openGame       chan UserName
	gameOpened     chan map[GameId]*Game
	joinGame       chan JoinGamePayload
}

func (p *purple) RegisterUser() <-chan UserName {
	return p.registerUser
}

func (p *purple) UserRegistered() chan<- map[UserId]UserName {
	return p.userRegistered
}

func (p *purple) OpenGame() <-chan UserName {
	return p.openGame
}

func (p *purple) GameOpened() chan<- map[GameId]*Game {
	return p.gameOpened
}

func (p *purple) JoinGame() <-chan JoinGamePayload {
	return p.joinGame
}

type JoinGamePayload struct {
	userId   UserId
	userName UserName
	gameId   GameId
}

// write wraps websocket.Conn.WriteJSON
func (c *Conn) write(v interface{}) error {
	return c.conn.WriteJSON(v)
}

// UpdateState sends registered users and open games to the client.
func (c *Conn) UpdateState(id UserId) error {
	state.Lock()
	defer state.Unlock()
	if err := c.UserRegistered(state.users); err != nil {
		log.Println(state.users, "UserRegistered")
		return nil
	}
	if err := c.GameOpened(state.games); err != nil {
		log.Println(state.games, "GameOpened")
		return nil
	}

	return nil
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
		if e.Kind == KindRegisterUser {
			c.purple.registerUser <- UserName(e.Data["name"])
		} else if e.Kind == KindOpenGame {
			c.purple.openGame <- UserName(e.Data["host"])
		} else if e.Kind == KindJoinGame {
			c.purple.joinGame <- JoinGamePayload{
				UserId(e.Data["userId"]),
				UserName(e.Data["userName"]),
				GameId(e.Data["gameId"]),
			}
		} else {
			h, ok := c.handlers[e.Kind]
			if !ok {
				log.Println("skipping handler", c, e.Kind)
				continue
			}
			log.Println("handling", e.Kind, h(c, e.Data))
		}
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Healthy!")
}

func handleWebsocket(w http.ResponseWriter, r *http.Request) {
	userId := NewUserId()
	if cookie, err := r.Cookie(cookiename); err == nil {
		userId = UserId(cookie.Value)
	}
	http.SetCookie(w, mintCookie(userId))

	ws, err := upgrader.Upgrade(w, r, w.Header())
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "error: %s", err)
		log.Println("establishing websocket connection", err)
		return
	}
	c := NewConn(ws, userId)
	go func() {
		for {
			select {
			case userName := <-c.purple.RegisterUser():
				onRegisterUser(userId, userName)
			case users := <-c.purple.userRegistered:
				if err := c.UserRegistered(users); err != nil {
					log.Printf("UserRegistered: %v", err)
				}
			case host := <-c.purple.OpenGame():
				onOpenGame(userId, host)
			case games := <-c.purple.gameOpened:
				if err := c.GameOpened(games); err != nil {
					log.Printf("GameOpeend: %v", err)
				}
			case joinGamePayload := <-c.purple.JoinGame():
				onJoinGame(
					joinGamePayload.userId,
					joinGamePayload.userName,
					joinGamePayload.gameId,
				)
			case <-r.Context().Done():
				log.Println("request closed")
				return
			}
		}
	}()
	//c.Register(KindRegisterUser, onRegisterUser)
	//c.Register(KindOpenGame, onOpenGame)
	//c.Register(KindJoinGame, onJoinGame)
	c.Register(KindTick, onTick)

	if err := c.UpdateState(userId); err != nil {
		log.Println(userId, "UpdateState")
		return
	}

	log.Println(userId, "storing connection")
	func() {
		state.Lock()
		defer state.Unlock()
		state.connections[userId] = c
	}()

	c.Listen()
}

func mintCookie(userId UserId) *http.Cookie {
	c := &http.Cookie{
		Name:     cookiename,
		Value:    string(userId),
		MaxAge:   86400,
		SameSite: http.SameSiteLaxMode,
	}
	if len(os.Args) != 2 { // the server is running on the internet
		c.Domain = "playimperial.club"
		c.Secure = true
	}
	return c
}

func onRegisterUser(userId UserId, name UserName) error {
	log.Printf("%s: %s(%s)\n", KindRegisterUser, name, userId)

	state.Lock()
	defer state.Unlock()
	state.users[userId] = name

	for _, conn := range state.connections {
		conn.purple.userRegistered <- state.users
	}

	return nil
}

func onOpenGame(userId UserId, name UserName) error {
	log.Printf("%s: %s(%s) is opening a game\n", KindOpenGame, name, userId)

	gameId := NewGameId()
	state.Lock()
	defer state.Unlock()
	state.games[gameId] = &Game{[]Action{}, map[UserId]UserName{userId: name}, name}

	for _, conn := range state.connections {
		conn.purple.gameOpened <- state.games
	}

	return nil
}

func onJoinGame(userId UserId, userName UserName, gameId GameId) error {
	log.Printf("%s: %s(%s) is joining a game(%s)\n", KindJoinGame, userName, userId, gameId)

	state.Lock()
	defer state.Unlock()
	state.games[gameId].Players[userId] = userName

	for _, conn := range state.connections {
		conn.purple.gameOpened <- state.games
	}

	return nil
}

func onTick(c *Conn, data Data) error {
	if err := data.Validate("gameId", "action"); err != nil {
		return err
	}
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

	state.Lock()
	defer state.Unlock()
	state.games[gameId].Log = append(state.games[gameId].Log, action)

	log.Printf("%s: %s", KindTick, state.games[gameId].Log)

	for _, conn := range state.connections {
		if err := conn.UpdateGameLog(gameId, state.games[gameId].Log); err != nil {
			log.Println(state.games[gameId].Log, "UpdateGameLog")
			return nil
		}
	}

	return nil
}
