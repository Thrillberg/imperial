![](https://github.com/Thrillberg/imperial/workflows/Node.js%20CI/badge.svg)

# Imperial

This is an implementation of the board game, [Imperial](https://en.wikipedia.org/wiki/Imperial_(board_game)).

## To run locally:
```
make ci
make client/run # in one terminal
make server/run # in another terminal
```

Navigate to `http://localhost:9080` in a web browser.

## To run tests:
```
make ci
```

## What the heck is a _Schnelleinsteig_??

You may notice a couple files, `schnelleinsteigLog.js` and `schnelleinsteig.test.js`. The first of these is a log taken from an imaginary 5-round game that was described in a pamphlet that came with my copy of the game. The second of these is a series of tests that helped motivate early development of the core game logic. They are currently in the process of being phased out in favor of the tests in `imperial.test.js`.
