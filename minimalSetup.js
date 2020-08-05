export default ({ players, provinceNames }) => {
  return {
    currentNation: "nation",
    nations: new Map([
      ["nation", { controller: "player1" }],
      ["nation2", { controller: "player2" }],
    ]),
    units: new Map([
      [
        "nation",
        new Map([
          ["a", { armies: 0, fleets: 0 }],
          ["b", { armies: 0, fleets: 0 }],
        ]),
      ],
      ["nation2", new Map()],
    ]),
  };
};
