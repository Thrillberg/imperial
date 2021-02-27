import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

import ActionCable from "actioncable";

class APIClient {
  constructor() {
    this.ws = this.initws();
    this.handlers = {};
    this.messageQueue = [];
  }

  initws() {
    const ws = ActionCable.createConsumer("/ws");
    ws.subscriptions.create("GameChannel", {
      connected: () => {
        this.messageQueue.forEach(data =>
          this.send(data, "GameChannel")
        );
        this.messageQueue = [];
      },
      received: envelope => {
        if (this.handlers[envelope.kind]) {
          this.handlers[envelope.kind](envelope.data);
        } else {
          console.error(envelope);
          throw new Error(`unhandled kind: ${envelope.kind}`);
        }
      }
    });
    ws.subscriptions.create("AppearanceChannel", {
      received: envelope => {
        if (this.handlers[envelope.kind]) {
          this.handlers[envelope.kind](envelope.data);
        } else {
          console.error(envelope);
          throw new Error(`unhandled kind: ${envelope.kind}`);
        }
      }
    });
    return ws;
  }

  onclose() {
    console.info("replacing closed websocket");
    this.ws = this.initws();
  }

  onerror(err) {
    console.error("websocket error", err);
  }

  send(data, channel) {
    if (this.ws.connection.webSocket?.readyState === WebSocket.OPEN) {
      const sendableData = {
        command: "message",
        identifier: JSON.stringify({ channel }),
        data: JSON.stringify(data)
      };
      this.ws.send(sendableData);
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
    return this.send(
      {
        kind: "joinGame",
        data: { userName, userId, gameId }
      },
      "GameChannel"
    );
  }

  openGame(host) {
    return this.send(
      {
        kind: "openGame",
        data: { host }
      },
      "GameChannel"
    );
  }

  getGameLog(gameId) {
    return this.send(
      {
        kind: "getGameLog",
        data: { gameId }
      },
      "GameChannel"
    );
  }

  updateUser(username, oldUsername) {
    return this.send(
      {
        kind: "updateUser",
        data: { username, oldUsername }
      },
      "AppearanceChannel"
    );
  }

  updateGames() {
    return this.send(
      {
        kind: "updateGames",
        data: {}
      },
      "GameChannel"
    );
  }

  tick(gameId, action) {
    return this.send(
      {
        kind: "tick",
        data: { gameId, action: JSON.stringify(action) }
      },
      "GameChannel"
    );
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
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue")
  },
  {
    path: "/sign_in",
    name: "Sign In",
    component: () => import("../views/SignIn.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue")
  },
  {
    path: "/rules",
    name: "How to play",
    component: () => import("../views/Rules.vue")
  },
  {
    path: "/game/:id",
    name: "Game",
    component: () => import("../views/Game.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
export { apiClient };
