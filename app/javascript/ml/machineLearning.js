// const tf = require("@tensorflow/tfjs-node");
// const fs = require("fs");

import * as tf from '@tensorflow/tfjs';

import Imperial from '../Domain/ImperialGameCoordinator';

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
    // stateArray[12] = AH's flag count
    // stateArray[13] = IT's flag count
    // stateArray[14] = FR's flag count
    // stateArray[15] = GB's flag count
    // stateArray[16] = GE's flag count
    // stateArray[17] = RU's flag count
    // stateArray[18] = Number of available bonds
    // stateArray[19] = player1's cash
    // stateArray[20] = player1's rawScore
    // stateArray[21] = player1's bond count
    let index = 0;
    for (const [, data] of game.nations) {
      stateArray[index] = this.rondelPositionIndex(data.rondelPosition);
      index += 1;
    }
    for (const [, data] of game.nations) {
      stateArray[index] = data.powerPoints;
      index += 1;
    }
    for (const [nation] of game.nations) {
      let flagCount = 0;
      for (const [, provinceData] of game.provinces) {
        if (provinceData.flag?.value === nation.value) {
          flagCount += 1;
        }
      }
      stateArray[index] = flagCount;
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
      '../ml_models',
      // 'file://app/javascript/lib/ml_models/model.json'
    );
    const result = model.predict(tf.tensor(sample, [1, sample.length])).arraySync();
    console.log(result)
    const maxResult = Math.max(...result[0]);
    const bucket = 10 - result[0].indexOf(maxResult);
    return bucket;
  }

  static async bestAction(availableActions, game, playerName) {
    const nextGameStates = availableActions.map((action) => {
      const clonedGame = new Imperial();
      clonedGame.tickFromLog(game.log);
      clonedGame.tick(action);
      console.log(game, clonedGame)
      return this.stateArray(clonedGame, playerName);
    });
    console.log(nextGameStates)
    let buckets = [];
    for (const gameState of nextGameStates) {
      const nextGameState = this.predictSample(gameState);
      buckets = buckets.concat(nextGameState);
    }
    buckets = await Promise.all(buckets);
    console.log(buckets)
    const winningBucket = Math.max(...buckets);
    const bucketIndex = buckets.indexOf(winningBucket);
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
  AHFlagCount,
  ITFlagCount,
  FRFlagCount,
  GBFlagCount,
  GEFlagCount,
  RUFlagCount,
  NumberOfAvailableBonds,
  CurrentPlayerCash,
  CurrentPlayerRawScore,
  CurrentPlayerBondCount,
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
    normalize(AHFlagCount, 0, 24),
    normalize(ITFlagCount, 0, 24),
    normalize(FRFlagCount, 0, 24),
    normalize(GBFlagCount, 0, 24),
    normalize(GEFlagCount, 0, 24),
    normalize(RUFlagCount, 0, 24),
    normalize(NumberOfAvailableBonds, 0, 54),
    normalize(CurrentPlayerCash),
    normalize(CurrentPlayerRawScore),
    normalize(CurrentPlayerBondCount, 0, 54),
  ];
  return { xs, ys: annotation };
};

const trainingData = tf.data.csv('file://app/javascript/ml/gameStates.csv')
  .map(csvTransform)
  .shuffle(fs.readFileSync('app/javascript/ml/gameStates.csv', 'utf8').length - 1)
  .batch(100);

const model = tf.sequential();
model.add(tf.layers.dense({units: 250, activation: 'relu', inputShape: [22]}));
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

run(15, 'file:///Users/eric/code/imperial/app/javascript/ml/ml_models')