import Imperial from "./imperial.js";

class monteCarloNode {
  constructor(parent, action, log, unexploredActions) {
    this.action = action;
    this.log = log;

    this.plays = 0;
    this.wins = 0;

    this.parent = parent;
    this.children = new Map();

    for (const action of unexploredActions) {
      this.children.set(JSON.stringify(action), { action, node: null });
    }
  }

  childNode(action) {
    let child = this.children.get(JSON.stringify(action))
    if (child === undefined) {
      throw new Error("Illegal action!")
    }
    else if (child.node === null) {
      throw new Error("Child is not explored!")
    }
    return child.node
  }

  explore(action, childState, unexploredActions) {
    if (!this.children.has(JSON.stringify(action))) throw new Error("Illegal action!");
    const childNode = new monteCarloNode(
      this,
      action,
      childState,
      unexploredActions
    );
    this.children.set(JSON.stringify(action), { action, node: childNode });
    return childNode;
  }

  allActions() {
    let out = [];
    for (const child of this.children.values()) {
      out.push(child.action)
    };
    return out;
  }

  unexploredActions() {
    let out = [];
    for (const child of this.children.values()) {
      if (child.node === null) out.push(child.action)
    };
    return out;
  }

  isFullyExplored() {
    for (const child of this.children.values()) {
      if (child.node === null) return false;
    }
    return true;
  }

  isLeaf() {
    if (this.children.size === 0) return true
    else return false
  }

  getUCB1(biasParam) {
    return (this.wins / this.plays) +
      Math.sqrt(
        biasParam * Math.log(this.parent.plays) / this.plays
      );
  }
}

export default class monteCarlo {
  constructor(game, UCB1ExploreParam = 2) {
    this.game = game;
    this.UCB1ExploreParam = UCB1ExploreParam;
    this.nodes = new Map();
  }

  makeNode(log) {
    if (!this.nodes.has(JSON.stringify(log))) {
      const game = Imperial.fromLog(log);
      const unexploredActions = Array.from(game.availableActions).slice();
      const node = new monteCarloNode(null, null, log, unexploredActions);
      this.nodes.set(JSON.stringify(log), node);
    }
  }

  runSearch(log, timeout = 10) {
    this.makeNode(log);

    const end = Date.now() + timeout * 1000;
    while (Date.now() < end) {
      let game = Imperial.fromLog(log);
      let node = this.select(log);
      let winner = game.winner;

      if (!node.isLeaf() && !winner) {
        node = this.explore(node, game);
        winner = this.simulate(node, game)
        console.log(node)
      }
      this.backpropogate(node, winner, game);
    }
  }

  bestAction(log) {
    this.makeNode(log);

    if (!this.nodes.get(JSON.stringify(log)).isFullyExplored()) {
      throw new Error("Not enough information");
    }

    const node = this.nodes.get(JSON.stringify(log));
    const allActions = node.allActions();
    let bestAction;
    let max = -Infinity;

    for (const action of allActions) {
      const childNode = node.childNode(action);
      if (childNode.plays > max) {
        bestAction = action;
        max = childNode.plays;
      }
    }

    return bestAction;
  }

  select(log) {
    let node = this.nodes.get(JSON.stringify(log));
    while (node.isFullyExplored() && !node.isLeaf()) {
      const actions = node.allActions();
      let bestAction;
      let bestUCB1 = -Infinity;

      for (const action of actions) {
        let childUCB1 = node.childNode(action).getUCB1(
          this.UCB1ExploreParam
        )
        if (childUCB1 > bestUCB1) {
          bestAction = action;
          bestUCB1 = childUCB1;
        }
      }

      node = node.childNode(bestAction);
    }
    return node;
  }

  explore(node, game) {
    const actions = node.unexploredActions();
    const index = Math.floor(Math.random() * actions.length);
    const action = actions[index];

    game.tick(action);
    const childUnexploredActions = game.availableActions;
    const childNode = node.explore(action, game.log, childUnexploredActions);
    this.nodes.set(JSON.stringify(game.log), childNode);

    return childNode;
  }

  simulate(node, game) {
    let log = node.log;
    let winner = game.winner;

    while (!winner) {
      const actions = Array.from(game.availableActions);
      const action = actions[Math.floor(Math.random() * actions.length)];
      game.tick(action);
      log = game.log;
      winner = game.winner;
    }
  }

  backpropogate(node, winner, game) {
    while (node !== null) {
      node.plays += 1;
      if (game.winner === winner) {
        node.wins += 1;
      }
      node = node.parent;
    }
  }
}
