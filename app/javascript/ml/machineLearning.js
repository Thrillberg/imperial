//import Imperial from "./imperial.js";
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
// import * as tf from "@tensorflow/tfjs-node";
// import fs from "fs";
//import * as tf from '@tensorflow/tfjs';

export default class MachineLearning {
// class MachineLearning {
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
    return availableActions[bucketIndex];
  }
}

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
    normalize(NumberOfAvailableBonds, 0, 54),
    normalize(Cash),
    normalize(RawScore),
    normalize(NumberOfOwnedBonds, 0, 54),
  ];
  return { xs, ys: annotation };
}

const trainingData = tf.data.csv('file://app/javascript/ml/gameStates.csv')
  .map(csvTransform)
  .shuffle(fs.readFileSync('app/javascript/ml/gameStates.csv', 'utf8').length - 1)
  .batch(100);

const model = tf.sequential();
model.add(tf.layers.dense({units: 250, activation: 'relu', inputShape: [16]}));
model.add(tf.layers.dense({units: 175, activation: 'relu'}));
model.add(tf.layers.dense({units: 150, activation: 'relu'}));
model.add(tf.layers.dense({units: 11, activation: 'softmax'}));
model.compile({
  optimizer: tf.train.adam(),
  loss: 'sparseCategoricalCrossentropy',
  metrics: ['accuracy'],
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

run(6, 'file:///Users/eric/code/imperial/app/javascript/ml/ml_models')