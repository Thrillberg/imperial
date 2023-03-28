import { Logtail } from '@logtail/browser';

export default class Logger {
  #scope;
  #gameId;

  #logtail;

  constructor(scope, gameId) {
    this.#scope = scope;
    this.#gameId = gameId;

    this.#logtail = new Logtail('3bdHcA8P3mcww2ojgC5G8YiT');
  }

  error(message, data) {
    data.gameId = this.#gameId;

    switch (this.#scope) {
      case 'production':
        this.#logtail.error(message, data);
        break;

      case 'replay':
      case 'silent':
        // no-op
        break;

      default:
        console.error(message, data);
        break;
    }
  }
}
