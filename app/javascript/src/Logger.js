export default class Logger {
  #scope;
  #gameId;

  constructor(scope, gameId) {
    this.#scope = scope;
    this.#gameId = gameId;
  }

  error(message, data) {
    data.gameId = this.#gameId;

    switch (this.#scope) {
      case 'production':
        console.error(message, data);
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
