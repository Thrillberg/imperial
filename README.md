[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md) 
![](https://github.com/Thrillberg/imperial/workflows/Node.js%20CI/badge.svg)

# Imperial

This is an implementation of the board game, [Imperial](<https://en.wikipedia.org/wiki/Imperial_(board_game)>).

_Please note that this project is released with a Contributor Code of Conduct.
By participating in this project you agree to abide by its terms._

## To run locally:

### Prerequisites:

Imperial requires [npm](https://www.npmjs.com/).

```
npm i -g npm
```

Imperial requires [Go](https://golang.org/). It can be downloaded [here](https://golang.org/doc/install).

### Running client and server:

```
make ci
make client/run # in one terminal
make server/run # in another terminal
```

Navigate to `http://localhost:8081` in a web browser.

## To run tests:

```
make ci
```

## To deploy the client side code:

```
make client/deploy
```

_N.B. The above deploy command requires a configured [`AWS CLI`](https://aws.amazon.com/cli/)!_

## What the heck is a _Schnelleinsteig_??

You may notice a couple files, `schnelleinsteigLog.js` and `schnelleinsteig.test.js`. The first of these is a log taken from an imaginary 5-round game that was described in a pamphlet that came with my copy of the game. The second of these is a series of tests that helped motivate early development of the core game logic. They are currently in the process of being phased out in favor of the tests in `imperial.test.js`.
