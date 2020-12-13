import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

class APIClient {
  constructor() {
    this.ws = this.initws();
    this.handlers = {};
  }

  initws() {
    const ws = new WebSocket(process.env.VUE_APP_IMPERIAL_WEBSOCKETS_URL);
    ws.onmessage = message => {
      const envelope = JSON.parse(message.data);
      if (this.handlers[envelope.kind]) {
        this.handlers[envelope.kind](envelope.data);
      } else {
        console.error(envelope);
        throw new Error(`unhandled kind: ${envelope.kind}`);
      }
    };
    ws.onclose = this.onclose.bind(this);
    return ws;
  }

  onclose() {
    console.info("replacing closed websocket");
    this.ws = this.initws();
  }

  send(data) {
    try {
      this.ws.send(JSON.stringify(data));
    } catch (e) {
      console.error("sending message", e);
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

  onGameOpened(cb) {
    if (this.handlers["gameOpened"] !== undefined) {
      throw new Error("there is already a handler defined");
    }
    this.handlers["gameOpened"] = cb;
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
