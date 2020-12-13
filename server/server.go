package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
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
	conn   *websocket.Conn
	userId UserId
	channels *channels
}

// NewConn allocates and initializes a new Conn.
func NewConn(ws *websocket.Conn, userId UserId) *Conn {
	return &Conn{
		conn:   ws,
		userId: userId,
		channels: &channels{
			registerUser:   make(chan UserName),
			userRegistered: make(chan map[UserId]UserName, 1),
			openGame:       make(chan UserName),
			gameOpened:     make(chan map[GameId]*Game, 1),
			joinGame:       make(chan JoinGamePayload),
			tick:           make(chan TickPayload),
		},
	}
}

type channels struct {
	registerUser   chan UserName
	userRegistered chan map[UserId]UserName
	openGame       chan UserName
	gameOpened     chan map[GameId]*Game
	joinGame       chan JoinGamePayload
	tick           chan TickPayload
}

func (p *channels) RegisterUser() <-chan UserName {
	return p.registerUser
}

func (p *channels) UserRegistered() chan<- map[UserId]UserName {
	return p.userRegistered
}

func (p *channels) OpenGame() <-chan UserName {
	return p.openGame
}

func (p *channels) GameOpened() chan<- map[GameId]*Game {
	return p.gameOpened
}

func (p *channels) JoinGame() <-chan JoinGamePayload {
	return p.joinGame
}

func (p *channels) Tick() <-chan TickPayload {
	return p.tick
}

type JoinGamePayload struct {
	userId   UserId
	userName UserName
	gameId   GameId
}

type TickPayload struct {
	gameId GameId
	action Action
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

// Listen starts an infinite loop of reading messages from the client.
func (c *Conn) Listen() {
	for {
		e := Envelope{}
		if err := c.conn.ReadJSON(&e); err != nil {
			log.Println("read error", err)
			return
		}
		if e.Kind == KindRegisterUser {
			c.channels.registerUser <- UserName(e.Data["name"])
		} else if e.Kind == KindOpenGame {
			c.channels.openGame <- UserName(e.Data["host"])
		} else if e.Kind == KindJoinGame {
			c.channels.joinGame <- JoinGamePayload{
				UserId(e.Data["userId"]),
				UserName(e.Data["userName"]),
				GameId(e.Data["gameId"]),
			}
		} else if e.Kind == KindTick {
			c.channels.tick <- TickPayload{
				GameId(e.Data["gameId"]),
				Action(e.Data["action"]),
			}
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
			case userName := <-c.channels.RegisterUser():
				onRegisterUser(userId, userName)
			case users := <-c.channels.userRegistered:
				if err := c.UserRegistered(users); err != nil {
					log.Printf("UserRegistered: %v", err)
				}
			case host := <-c.channels.OpenGame():
				onOpenGame(userId, host)
			case games := <-c.channels.gameOpened:
				if err := c.GameOpened(games); err != nil {
					log.Printf("GameOpeend: %v", err)
				}
			case joinGamePayload := <-c.channels.JoinGame():
				onJoinGame(
					joinGamePayload.userId,
					joinGamePayload.userName,
					joinGamePayload.gameId,
				)
			case tickPayload := <-c.channels.Tick():
				onTick(tickPayload.gameId, tickPayload.action)
			case <-r.Context().Done():
				log.Println("request closed")
				return
			}
		}
	}()

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
		conn.channels.userRegistered <- state.users
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
		conn.channels.gameOpened <- state.games
	}

	return nil
}

func onJoinGame(userId UserId, userName UserName, gameId GameId) error {
	log.Printf("%s: %s(%s) is joining a game(%s)\n", KindJoinGame, userName, userId, gameId)

	state.Lock()
	defer state.Unlock()
	state.games[gameId].Players[userId] = userName

	for _, conn := range state.connections {
		conn.channels.gameOpened <- state.games
	}

	return nil
}

func onTick(gameId GameId, action Action) error {
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
