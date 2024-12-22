import ActionCable from 'actioncable';
import { createRouter, createWebHistory } from 'vue-router';
import * as Sentry from '@sentry/vue';
import Home from '../views/Home.vue';

class APIClient {
  constructor() {
    this.ws = this.initws();
    this.handlers = {};
    this.messageQueue = [];
    this.maxQueueSize = 100;
  }

  initws() {
    const ws = ActionCable.createConsumer('/ws');
    ws.subscriptions.create('GameChannel', {
      connected: () => {
        this.messageQueue.forEach((data) => this.send(data, 'GameChannel'));
        this.messageQueue = [];
      },
      received: (envelope) => {
        if (this.handlers[envelope.kind]) {
          this.handlers[envelope.kind](envelope.data);
        } else {
          Sentry.captureMessage(`Unhandled kind: ${envelope.kind}`, envelope);
        }
      },
    });
    ws.subscriptions.create('AppearanceChannel', {
      received: (envelope) => {
        if (this.handlers[envelope.kind]) {
          this.handlers[envelope.kind](envelope.data);
        } else {
          Sentry.captureMessage(`Unhandled kind: ${envelope.kind}`, envelope);
        }
      },
    });
    return ws;
  }

  onclose(event) {
    Sentry.captureMessage(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
    if (event.code !== 1000) {
      this.ws?.connection?.webSocket?.close();

      setTimeout(() => {
        this.ws = this.initws();
      }, 5000);
    }
  }

  beforeunload() {
    this.ws?.connection?.webSocket?.close();
  }

  send(data, channel) {
    if (this.ws.connection.webSocket?.readyState === WebSocket.OPEN) {
      const sendableData = {
        command: 'message',
        identifier: JSON.stringify({ channel }),
        data: JSON.stringify(data),
      };
      this.ws.send(sendableData);
    } else {
      if (this.messageQueue.length >= this.maxQueueSize) {
        Sentry.captureMessage('Message queue is full, dropping message');
        return;
      }
      this.messageQueue.push(data);
    }
  }

  clearHandlers() {
    this.handlers = {};
  }

  onUpdateUsers(cb) {
    if (this.handlers.updateUsers !== undefined) {
      throw new Error('there is already a handler defined');
    }
    this.handlers.updateUsers = cb;
  }

  onUpdateGames(cb) {
    if (this.handlers.updateGames !== undefined) {
      throw new Error('there is already a handler defined');
    }
    this.handlers.updateGames = cb;
  }

  onUpdateGameLog(cb) {
    if (this.handlers.updateGameLog !== undefined) {
      throw new Error('there is already a handler defined');
    }
    this.handlers.updateGameLog = cb;
  }

  onUpdateCurrentPlayerName(cb) {
    if (this.handlers.updateCurrentPlayerName !== undefined) {
      throw new Error('there is already a handler defined');
    }
    this.handlers.updateCurrentPlayerName = cb;
  }

  joinGame(userId, gameId, userName) {
    return this.send(
      {
        kind: 'joinGame',
        data: { userName, userId, gameId },
      },
      'GameChannel',
    );
  }

  openGame(id, baseGame, variant, timeCommitment, createDiscordChannel, isGamePublic) {
    return fetch('/api/games', {
      method: 'POST',
      body: JSON.stringify({
        id,
        base_game: baseGame,
        variant,
        create_discord_channel: createDiscordChannel,
        is_game_public: isGamePublic,
        time_commitment: timeCommitment,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((game) => {
        this.send({ kind: 'openGame' }, 'GameChannel');
        return game;
      });
  }

  getGameLog(gameId) {
    return this.send(
      {
        kind: 'getGameLog',
        data: { gameId },
      },
      'GameChannel',
    );
  }

  updateUser(username, oldUsername) {
    return this.send(
      {
        kind: 'updateUser',
        data: { username, oldUsername },
      },
      'AppearanceChannel',
    );
  }

  updateGames() {
    return this.send(
      {
        kind: 'updateGames',
        data: {},
      },
      'GameChannel',
    );
  }

  tick(gameId, action) {
    return this.send(
      {
        kind: 'tick',
        data: { gameId, action: JSON.stringify(action) },
      },
      'GameChannel',
    );
  }

  saveSnapshot(gameId, action, oldState = {}, availableActions = [], log = []) {
    return this.send(
      {
        kind: 'saveSnapshot',
        data: {
          gameId,
          action: JSON.stringify(action),
          state: JSON.stringify(oldState),
          availableActions: JSON.stringify(availableActions),
          log: JSON.stringify(log),
        },
      },
      'GameChannel',
    );
  }

  updateCurrentPlayerName(gameId, currentPlayerName) {
    return this.send(
      {
        kind: 'updateCurrentPlayerName',
        data: { gameId, currentPlayerName },
      },
      'GameChannel',
    );
  }

  notifyNextPlayer(gameId, nextPlayerName) {
    return this.send(
      {
        kind: 'notifyNextPlayer',
        data: { gameId, nextPlayerName },
      },
      'GameChannel',
    );
  }

  updateWinner(gameId, winnerName, scores) {
    return this.send(
      {
        kind: 'updateWinnerName',
        data: { gameId, winnerName, scores },
      },
      'GameChannel',
    );
  }

  cancel(gameId) {
    return this.send(
      {
        kind: 'cancelGame',
        data: { gameId },
      },
      'GameChannel',
    );
  }

  boot(playerName, gameId) {
    return this.send(
      {
        kind: 'bootPlayer',
        data: { playerName, gameId },
      },
      'GameChannel',
    );
  }

  userObservingGame(playerName, gameId) {
    return this.send(
      {
        kind: 'userObservingGame',
        data: { playerName, gameId },
      },
      'GameChannel',
    );
  }

  userStoppedObservingGame(playerName, gameId) {
    return this.send(
      {
        kind: 'userStoppedObservingGame',
        data: { playerName, gameId },
      },
      'GameChannel',
    );
  }
}

const apiClient = new APIClient();

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/sign_in',
    name: 'Sign In',
    component: () => import('../views/SignIn.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/rules',
    name: 'How to play',
    component: () => import('../views/Rules.vue'),
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: () => import('../views/Game.vue'),
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('../views/Games.vue'),
  },
  {
    path: '/finished_games',
    name: 'Finished Games',
    component: () => import('../views/FinishedGames.vue'),
  },
  {
    path: '/users/:id',
    name: 'User',
    component: () => import('../views/User.vue'),
  },
  {
    path: '/games/new',
    name: 'NewGame',
    component: () => import('../views/NewGame.vue'),
  },
  {
    path: '/games/open',
    name: 'OpenGames',
    component: () => import('../views/OpenGames.vue'),
  },
  {
    path: '/cloned_games',
    name: 'ClonedGames',
    component: () => import('../views/ClonedGames.vue'),
  },
  {
    path: '/import_game',
    name: 'ImportGame',
    component: () => import('../views/ImportGame.vue'),
  },
  {
    path: '/forgot_password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
  },
  {
    path: '/reset_password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
  },
  {
    path: '/rankings',
    name: 'Rankings',
    component: () => import('../views/Rankings.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Navigating from ${from.fullPath} to ${to.fullPath}`,
    level: 'info',
    data: {
      from: from.fullPath,
      to: to.fullPath,
    },
  });
  next();
});

router.afterEach((to, from) => {
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Finished navigating to ${to.fullPath}`,
    level: 'info',
    data: {
      from: from.fullPath,
      to: to.fullPath,
    },
  });
});

export default router;
export { apiClient };
