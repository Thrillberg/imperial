//import Imperial from "./imperial.js";
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
// import * as tf from "@tensorflow/tfjs-node";
// import fs from "fs";
//import * as tf from '@tensorflow/tfjs';

export default class MachineLearning {
// class MachineLearning {
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
  annotation,
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

run(6, 'file:///Users/eric/code/imperial/app/javascript/ml/ml_models');