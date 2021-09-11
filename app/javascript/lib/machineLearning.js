//import Imperial from "./imperial.js";
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
//import fs from "fs";
//import * as tf from "@tensorflow/tfjs-node";
//import * as tf from '@tensorflow/tfjs';

//export default class MachineLearning {
class MachineLearning {
  static stateArray(game, playerName) {
    let stateArray = [];
    // stateArray[0] = AH's rondel position
    // stateArray[1] = IT's rondel position
    // stateArray[2] = FR's rondel position
    // stateArray[3] = GB's rondel position
    // stateArray[4] = GE's rondel position
    // stateArray[5] = RU's rondel position
    // stateArray[6] = AH's power points
    // stateArray[7] = IT's power points
    // stateArray[8] = FR's power points
    // stateArray[9] = GB's power points
    // stateArray[10] = GE's power points
    // stateArray[11] = RU's power points
    // stateArray[12] = Number of available bonds
    // stateArray[13] = player1's cash
    // stateArray[14] = player1's rawScore
    // stateArray[15] = player1's bond count
    let index = 0;
    for (const [, data] of game.nations) {
      stateArray[index] = this.rondelPositionIndex(data.rondelPosition);
      index += 1;
    }
    for (const [, data] of game.nations) {
      stateArray[index] = data.powerPoints;
      index += 1;
    }
    stateArray[index] = game.availableBonds.size;
    index += 1;
    let player = game.players[playerName];
    stateArray[index] = player.cash;
    index += 1;
    stateArray[index] = player.rawScore;
    index += 1;
    stateArray[index] = player.bonds.size;
    return stateArray;
  }

  static rondelPositionIndex(name) {
    if (name === "taxation") {
      return 0;
    } else if (name === "factory") {
      return 1;
    } else if (name === "production1") {
      return 2;
    } else if (name === "maneuver1") {
      return 3;
    } else if (name === "investor") {
      return 4;
    } else if (name === "import") {
      return 5;
    } else if (name === "production2") {
      return 6;
    } else if (name === "maneuver2") {
      return 7;
    } else {
      return -1
    }
  }

  static annotation(difference) {
    if (difference >= 10) {
      return 9;
    } else if (difference >= 6) {
      return 8;
    } else if (difference >= 3) {
      return 7;
    } else if (difference >= 2) {
      return 6;
    } else if (difference >= 1) {
      return 5;
    } else if (difference >= 0) {
      return 4;
    } else if (difference >= -1) {
      return 3;
    } else if (difference >= -3) {
      return 2;
    } else if (difference >= -6) {
      return 1;
    } else {
      return 0;
    }
  }

  static async play(game) {
    // We're training to maximize player1's score and value winning
    // d = change in score over 25 moves
    // annotation 9: d >= 10
    // annotation 8: d >= 6 && d < 10
    // annotation 7: d >= 3 && d < 6
    // annotation 6: d >= 2 && d < 3
    // annotation 5: d >= 1 && d < 2
    // annotation 4: d >= 0 && d < 1
    // annotation 3: d >= -1 && d < 0
    // annotation 2: d >= -3 && d < -1
    // annotation 1: d >= -6 && d < -3
    // annotation 0: d < -6
    // 1 is added to annotation if player1 won the game
    let annotation;
    let players = [];
    let gameStates = [];

    while (game.winner === "") {
      const availableActions = Array.from(game.availableActions);
      let action;
      if (game.currentPlayerName === "player1") {
        action = await this.bestAction(availableActions, game, "player1")
      } else {
        action = availableActions[
          Math.floor(Math.random() * availableActions.length)
        ];
      }
      gameStates.push(this.stateArray(game, "player1"));
      game.tick(action);
    }
    //console.log("player1 raw score: ", game.players["player1"].rawScore)
    //console.log("player2 raw score: ", game.players["player2"].rawScore)
    console.log("Winner: ", game.winner)
    console.log("Game length: ", game.log.length)

    const out = gameStates.map((state, index) => {
      const score = state[13] + state[14];
      const futureIndex = Math.min(index + 25, gameStates.length - 1);
      const futureScore = gameStates[futureIndex][13] + gameStates[futureIndex][14];
      const difference = futureScore - score;
      let annotation = this.annotation(difference);
      if (game.winner === "player1") {
        annotation += 1
      }

      state.push(annotation);
      return state;
    });

    return out;
  }

  static async predictSample(sample) {
    const model = await tf.loadLayersModel(
      //"../ml_models"
      "file://app/javascript/lib/ml_models/model.json"
    );
    let result = model.predict(tf.tensor(sample, [1,sample.length])).arraySync();
    const maxResult = Math.max(...result[0])
    const bucket = 10 - result[0].indexOf(maxResult)
    return bucket
  }

  static async bestAction(availableActions, game, playerName) {
    const nextGameStates = availableActions.map(action => {
      game.tick(action)
      return this.stateArray(game, playerName)
    });
    let buckets = []
    for (const gameState of nextGameStates) {
      const nextGameState = await this.predictSample(gameState)
      buckets = buckets.concat(nextGameState)
    };
    const winningBucket = Math.max(...buckets)
    const bucketIndex = buckets.indexOf(winningBucket)
    return availableActions[bucketIndex]
  }

  static writeGame(playedGame) {
    let csvContent = "";
    playedGame.forEach((rowArray) => {
      let row = rowArray.join(",");
      csvContent += row + "\n";
    });
    fs.appendFile("app/javascript/lib/ml.csv", csvContent, () => {})
  }
}

const ml = new MachineLearning();

function normalize(value, min, max) {
  if (min === undefined || max === undefined) {
    return value;
  }
  return (value - min) / (max - min);
}

const csvTransform = ({
  AHRondelPosition,
  ITRondelPosition,
  FRRondelPosition,
  GBRondelPosition,
  GERondelPosition,
  RURondelPosition,
  AHPowerPoints,
  ITPowerPoints,
  FRPowerPoints,
  GBPowerPoints,
  GEPowerPoints,
  RUPowerPoints,
  NumberOfAvailableBonds,
  Cash,
  RawScore,
  NumberOfOwnedBonds,
  annotation
}) => {
  const xs = [
    normalize(AHRondelPosition, 0, 7),
    normalize(ITRondelPosition, 0, 7),
    normalize(FRRondelPosition, 0, 7),
    normalize(GBRondelPosition, 0, 7),
    normalize(GERondelPosition, 0, 7),
    normalize(RURondelPosition, 0, 7),
    normalize(AHPowerPoints, 0, 25),
    normalize(ITPowerPoints, 0, 25),
    normalize(FRPowerPoints, 0, 25),
    normalize(GBPowerPoints, 0, 25),
    normalize(GEPowerPoints, 0, 25),
    normalize(RUPowerPoints, 0, 25),
    normalize(NumberOfAvailableBonds, 0, 42),
    normalize(Cash),
    normalize(RawScore),
    normalize(NumberOfOwnedBonds, 0, 42),
  ];
  return {xs, ys: annotation};
}

const trainingData =
  tf.data.csv("file://app/javascript/lib/ml.csv")
    .map(csvTransform)
    .shuffle(fs.readFileSync("app/javascript/lib/ml.csv", "utf8").length - 1)
    .batch(100);

const model = tf.sequential();
model.add(tf.layers.dense({units: 250, activation: 'relu', inputShape: [16]}));
model.add(tf.layers.dense({units: 175, activation: 'relu'}));
model.add(tf.layers.dense({units: 150, activation: 'relu'}));
model.add(tf.layers.dense({units: 11, activation: 'softmax'}));
model.compile({
  optimizer: tf.train.adam(),
  loss: 'sparseCategoricalCrossentropy',
  metrics: ['accuracy']
});

async function run(epochCount, savePath) {
  model.summary();
  await model.fitDataset(trainingData, {
    epochs: epochCount,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch: ${epoch} - loss: ${logs.loss.toFixed(3)}`);
      }
    }
  });

  if (savePath !== null) {
    await model.save(savePath);
    console.log(`Saved model to path: ${savePath}`);
  }
}

run(6, "file:///Users/eric/code/imperial/app/javascript/lib/ml_models")
