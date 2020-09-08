package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"math/rand"
	"net/http"
)

type PlayerId uint64
type Action interface{}
type Envelope struct {
	Kind string
	Data interface{}
}

var connections = map[PlayerId]*websocket.Conn{}
var players = map[PlayerId]bool{}
var gameLog = []Action{}
var upgrader = websocket.Upgrader{CheckOrigin: func(*http.Request) bool { return true }}

func main() {
	http.HandleFunc("/ws", handleWebsocket)
	http.ListenAndServe(":8080", nil)
}

func handleWebsocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "error: %s", err)
		return
	}
	id := PlayerId(rand.Uint64())
	connections[id] = conn
	message, err := conn.NextWriter(websocket.TextMessage)
	if err != nil {
		log.Printf("NextWriter for player %d: %s\n%s\n", id, err, conn.Close())
		return
	}
	envelope := Envelope{"setPlayerId", id}
	marshalled, err := json.Marshal(&envelope)
	if err != nil {
		log.Printf("json.Marshal(%v) for player %d: %s", envelope, id, err)
		return
	}
	message.Write(marshalled)
	message.Close()
}
