import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

import ActionCable from "actioncable";

class APIClient {
  constructor() {
    this.ws = this.initws(this);
    this.handlers = {};
    this.messageQueue = [];
  }

  initws(client) {
    const ws = ActionCable.createConsumer(
      process.env.VUE_APP_IMPERIAL_WEBSOCKETS_URL
    );
    ws.subscriptions.create("AppearanceChannel", {
      received(envelope) {
        if (client.handlers[envelope.kind]) {
          client.handlers[envelope.kind](envelope.data);
        } else {
          console.error(envelope);
          throw new Error(`unhandled kind: ${envelope.kind}`);
        }
      }
    });
    return ws;
    //const ws = new WebSocket(process.env.VUE_APP_IMPERIAL_WEBSOCKETS_URL);
    //ws.onopen = () => {
    //  this.send({
    //    command: "subscribe",
    //    identifier: '{ "channel": "AppearanceChannel" }'
    //  });
    //  this.messageQueue.forEach(data => this.send(data));
    //  this.messageQueue = [];
    //};
    //ws.onmessage = message => {
    //  const envelope = JSON.parse(message.data);
    //  console.log(envelope);
    //  if (this.handlers[envelope.kind]) {
    //    this.handlers[envelope.kind](envelope.data);
    //  } else {
    //    console.error(envelope);
    //    throw new Error(`unhandled kind: ${envelope.kind}`);
    //  }
    //};
    //ws.onclose = this.onclose.bind(this);
    //ws.onerror = this.onerror.bind(this);
    //return ws;
  }

  onclose() {
    console.info("replacing closed websocket");
    this.ws = this.initws();
  }

  onerror(err) {
    console.error("websocket error", err);
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      this.messageQueue.push(data);
    }
  }

  clearHandlers() {
    this.handlers = {};
  }

  onUpdateUsers(cb) {
    if (this.handlers["updateUsers"] !== undefined) {
      throw new Error("there is already a handler defined");
    }
    this.handlers["updateUsers"] = cb;
  }

  onUpdateGames(cb) {
    if (this.handlers["updateGames"] !== undefined) {
      throw new Error("there is already a handler defined");
    }
    this.handlers["updateGames"] = cb;
  }

  onUpdateGameLog(cb) {
    if (this.handlers["updateGameLog"] !== undefined) {
      throw new Error("there is already a handler defined");
    }
    this.handlers["updateGameLog"] = cb;
  }

  joinGame(userId, gameId, userName) {
    return this.send({
      kind: "joinGame",
      data: { userName, userId, gameId }
    });
  }

  openGame(host) {
    return this.send({
      kind: "openGame",
      data: { host }
    });
  }

  registerUser(name) {
    return this.send({
      kind: "registerUser",
      data: { name }
    });
  }

  getGameLog(gameId) {
    return this.send({
      kind: "getGameLog",
      data: { gameId }
    });
  }

  tick(gameId, action) {
    return this.send({
      kind: "tick",
      data: { gameId, action: JSON.stringify(action) }
    });
  }
}

const apiClient = new APIClient();

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/game/:id",
    name: "Game",
    component: () => import("../views/Game.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
export { apiClient };
