export default ({ players, provinceNames }) => {
  return {
    currentNation: "nation",
    nations: new Map([
      ["nation", { controller: "player1", treasury: 13 }],
      ["nation2", { controller: "player2", treasury: 13 }],
    ]),
    provinces: new Map([
      ["a", { flag: null }],
      ["b", { flag: null }],
      ["c", { flag: null }],
      ["d", { flag: null }],
      ["e", { flag: null }],
      ["f", { flag: null }],
    ]),
    units: new Map([
      [
        "nation",
        new Map([
          ["a", { armies: 0, fleets: 0 }],
          ["b", { armies: 0, fleets: 0 }],
          ["c", { armies: 0, fleets: 0 }],
          ["d", { armies: 0, fleets: 0 }],
          ["e", { armies: 0, fleets: 0 }],
          ["f", { armies: 0, fleets: 0 }],
          ["g", { armies: 0, fleets: 0 }],
          ["h", { armies: 0, fleets: 0 }],
          ["i", { armies: 0, fleets: 0 }],
          ["j", { armies: 0, fleets: 0 }],
        ]),
      ],
      [
        "nation2",
        new Map([
          ["a", { armies: 0, fleets: 0 }],
          ["b", { armies: 0, fleets: 0 }],
          ["c", { armies: 0, fleets: 0 }],
          ["d", { armies: 0, fleets: 0 }],
          ["e", { armies: 0, fleets: 0 }],
          ["f", { armies: 0, fleets: 0 }],
          ["g", { armies: 0, fleets: 0 }],
          ["h", { armies: 0, fleets: 0 }],
          ["i", { armies: 0, fleets: 0 }],
          ["j", { armies: 0, fleets: 0 }],
        ]),
      ],
    ]),
  };
};
