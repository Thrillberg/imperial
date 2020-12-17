package main

import (
	"encoding/json"
	"fmt"
	lovely_strings "github.com/Thrillberg/imperial/server/lovely_strings"
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

type GameName string

type GameId string

type Game struct {
	Log     []Action            `json:"log"`
	Players map[UserId]UserName `json:"players"`
	Host    UserName            `json:"host"`
	Name    GameName            `json:"name"`
}

// NewUserId generates a string from a UUID.
func NewUserId() UserId {
	return UserId(uuid.New().String())
}

// NewGameId generates a string from a UUID.
func NewGameId() GameId {
	return GameId(uuid.New().String())
}

// NewGameName generates a lovely little string.
func NewGameName() GameName {
	return GameName(lovely_strings.DoYourThing())
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
	// KindUpdateUsers is sent to clients upon WebSockets connection and
	// when a user registers a name.
	KindUpdateUsers = Kind("updateUsers")
	// KindOpenGame is received from clients when they open a new game.
	KindOpenGame = Kind("openGame")
	// KindUpdateGames is sent to the clients upon WebSockets connection and
	// when a user opens a new game.
	KindUpdateGames = Kind("updateGames")
	// KindJoinGame is received from clients when they join a game.
	KindJoinGame = Kind("joinGame")
	// KindGetGameLog is received from clients when they navigate to a game.
	KindGetGameLog = Kind("getGameLog")
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
	userId   UserId
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
			gameJoined:     make(chan map[GameId]*Game, 1),
			getGameLog:     make(chan GameId),
			tick:           make(chan TickPayload),
			gameTicked:     make(chan map[string]string, 1),
		},
	}
}

type channels struct {
	registerUser   chan UserName
	userRegistered chan map[UserId]UserName
	openGame       chan UserName
	gameOpened     chan map[GameId]*Game
	joinGame       chan JoinGamePayload
	gameJoined     chan map[GameId]*Game
	getGameLog     chan GameId
	tick           chan TickPayload
	gameTicked     chan map[string]string
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

func (p *channels) GameJoined() chan<- map[GameId]*Game {
	return p.gameJoined
}

func (p *channels) GetGameLog() <-chan GameId {
	return p.getGameLog
}

func (p *channels) Tick() <-chan TickPayload {
	return p.tick
}

func (p *channels) GameTicked() chan<- map[string]string {
	return p.gameTicked
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
	if err := c.UpdateUsers(state.users); err != nil {
		log.Println(state.users, "UpdateUsers")
		return nil
	}
	if err := c.UpdateGames(state.games); err != nil {
		log.Println(state.games, "UpdateGames")
		return nil
	}

	return nil
}

// UpdateUsers sends a KindUpdateUsers message to the client.
func (c *Conn) UpdateUsers(users map[UserId]UserName) error {
	var usersSlice = []map[string]string{}
	for key, val := range users {
		usersSlice = append(usersSlice, map[string]string{"id": string(key), "name": string(val)})
	}
	usersList, _ := json.Marshal(usersSlice)

	return c.write(&Envelope{
		Kind: KindUpdateUsers,
		Data: map[string]string{
			"users": string(usersList),
		},
	})
}

// UpdateGames sends a KindUpdateGames message to the client.
func (c *Conn) UpdateGames(games map[GameId]*Game) error {
	var gamesSlice = []map[string]string{}
	for key, val := range games {
		parsedVal, _ := json.Marshal(val)
		gamesSlice = append(gamesSlice, map[string]string{"id": string(key), "game": string(parsedVal)})
	}
	gamesList, _ := json.Marshal(gamesSlice)

	return c.write(&Envelope{
		Kind: KindUpdateGames,
		Data: map[string]string{
			"games": string(gamesList),
		},
	})
}

// UpdateGameLog sends a KindUpdateGameLog message to the client.
func (c *Conn) UpdateGameLog(gameId string, gameLog string) error {
	return c.write(&Envelope{
		Kind: KindUpdateGameLog,
		Data: map[string]string{
			"gameId": gameId,
			"log":    gameLog,
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
		} else if e.Kind == KindGetGameLog {
			c.channels.getGameLog <- GameId(e.Data["gameId"])
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
				if err := c.UpdateUsers(users); err != nil {
					log.Printf("UpdateUsers: %v", err)
				}
			case host := <-c.channels.OpenGame():
				onOpenGame(userId, host)
			case games := <-c.channels.gameOpened:
				if err := c.UpdateGames(games); err != nil {
					log.Printf("UpdateGames: %v", err)
				}
			case joinGamePayload := <-c.channels.JoinGame():
				onJoinGame(
					joinGamePayload.userId,
					joinGamePayload.userName,
					joinGamePayload.gameId,
				)
			case games := <-c.channels.gameJoined:
				if err := c.UpdateGames(games); err != nil {
					log.Printf("UpdateGames: %v", err)
				}
			case gameId := <-c.channels.getGameLog:
				rawGameLog := state.games[gameId].Log
				gameLog, _ := json.Marshal(rawGameLog)
				if err := c.UpdateGameLog(string(gameId), string(gameLog)); err != nil {
					log.Printf("UpdateGameLog: %v", err)
				}
			case tickPayload := <-c.channels.Tick():
				onTick(tickPayload.gameId, tickPayload.action)
			case game := <-c.channels.gameTicked:
				if err := c.UpdateGameLog(game["gameId"], game["gameLog"]); err != nil {
					log.Printf("UpdateGameLog: %v", err)
				}
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
	gameName := NewGameName()
	state.Lock()
	defer state.Unlock()
	state.games[gameId] = &Game{
		[]Action{},
		map[UserId]UserName{userId: name},
		name,
		gameName,
	}

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
		conn.channels.gameJoined <- state.games
	}

	return nil
}

func onTick(gameId GameId, action Action) error {
	state.Lock()
	defer state.Unlock()

	game := state.games[gameId]

	game.Log = append(game.Log, action)
	log.Printf("%s: %s", KindTick, game.Log)

	connections := make([]*Conn, 0)
	for userId := range game.Players {
		connections = append(connections, state.connections[userId])
	}

	gameLog, _ := json.Marshal(game.Log)
	for _, conn := range connections {
		conn.channels.gameTicked <- map[string]string{"gameId": string(gameId), "gameLog": string(gameLog)}
	}

	return nil
}
