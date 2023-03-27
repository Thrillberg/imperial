import { Logtail } from '@logtail/browser';

export default class Logger {
  #environment;
  #gameId;
  #logtail;

  constructor(environment, gameId) {
    this.#environment = environment;
    this.#gameId = gameId;

    this.#logtail = new Logtail('3bdHcA8P3mcww2ojgC5G8YiT');
  }

  error(message, data) {
    data.gameId = this.#gameId;

    switch (this.#environment) {
      case 'production':
        this.#logtail.error(message, data);
        break;

      case 'replay':
      case 'unittests':
        // no-op
        break;

      default:
        console.error(message, data);
        break;
    }
  }
}