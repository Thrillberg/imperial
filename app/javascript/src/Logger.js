export default class Logger {
  #environment;
  #logtail;

  constructor(environment) {
    this.#environment = environment;

    this.#logtail = new Logtail('3bdHcA8P3mcww2ojgC5G8YiT');
  }

  error(message, data) {
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