import Imperial from "./imperial.js";
import Action from "./action.js";
import { Nation } from "./constants.js";

Vue.component("board", {
  props: ["board", "add_highlights"],
  template: `<div v-html="board"></div>`,
  mounted() {
    this.add_highlights();
  },
});

Vue.component("player", {
  props: ["name", "cash", "bonds", "current_player"],
  template: `
  <li class="player">
    <div v-if="name === current_player" class="current_player">
      🤩
    </div>
    <div class="contents">
      <h3>{{ name }}</h3>
      <div>Cash: {{ cash }} million</div>
      <div>
        Bonds:
        <ul class="bonds">
          <bond
            v-for="bond in bonds"
            v-bind:nation="bond.nation.value"
            v-bind:cost="bond.cost"
            v-bind:key="bond.nation.value + bond.cost"
          ></bond>
        </ul>
      </div>
    </div>
  </li>
  `,
});

Vue.component("nation", {
  props: ["flag", "treasury", "current_nation"],
  template: `<li><img v-bind:src="flag" class="md-flag"  :class="current_nation" /><div>{{ treasury }}m</div></li>`,
});

Vue.component("bond", {
  props: ["nation", "cost"],
  template: `<li class="bond">{{ nation }}{{ cost }}</li>`,
});

Vue.component("current-turn", {
  props: ["type", "payload"],
  template: `<div>{{ type }}{{ payload }}</div>`,
});

Vue.component("action", {
  props: ["action", "dispatch", "text"],
  template: `<button v-on:click="dispatch(action)">{{ text }}</button>`,
});

var app = new Vue({
  el: "#app",
  data: {
    board: "",
    game: {},
    gameStarted: false,
    rondel: "",
    importStatus: {
      active: false,
      placements: [],
      targets: [],
    },
    maneuverStatus: {
      active: false,
      endManeuver: Action.endManeuver(),
      origin: "",
    },
    name: "",
    players: new Set(),
    purchasingBond: false,
    buildingFactory: false,
    webSocket: new WebSocket("ws://localhost:8080/ws"),
  },
  mounted() {
    this.webSocket.onmessage = (message) => {
      const envelope = JSON.parse(message.data);
      switch (envelope.kind) {
        case "setId":
          this.setWebsocketId(envelope.data.id);
          break;
        case "updatePlayers":
          // TODO: I'm not a fan of JSON.parse after we've already JSON.parsed already
          this.players = new Set(JSON.parse(envelope.data.players));
          for (const player of this.players) {
            if (localStorage.imperialId === player.id) {
              this.name = player.name;
            }
          }
          break;
      }
    };
    fetch("rondel.svg")
      .then((response) => response.text())
      .then((text) => {
        this.rondel = text;
      });
    fetch("board.svg")
      .then((response) => response.text())
      .then((text) => {
        this.board = text;
      });
  },
  methods: {
    setWebsocketId: function (newId) {
      const oldId = localStorage.getItem("imperialId");
      if (oldId) {
        this.webSocket.send(
          JSON.stringify({
            kind: "updateId",
            data: { oldId, newId },
          })
        );
      }
      localStorage.setItem("imperialId", newId);
    },
    registerPlayer: function (name) {
      this.webSocket.send(
        JSON.stringify({
          kind: "updateName",
          data: { name: this.name, id: localStorage.imperialId },
        })
      );
    },
    startGame: function (playerCount) {
      const players = this.getPlayers(playerCount);
      this.game = Imperial.fromLog([Action.initialize({ players })]);
      this.gameStarted = true;
    },
    getPlayers: function (playerCount) {
      switch (playerCount) {
        case 2:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
          ];
        case 3:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
          ];
        case 4:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
          ];
        case 5:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
            { id: "Johann Heinrich Schröder", nation: Nation.RU },
          ];
        case 6:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
            { id: "Johann Heinrich Schröder", nation: Nation.RU },
            { id: "Gerson von Bleichröder", nation: Nation.GB },
          ];
      }
    },
    flag: function (nation) {
      switch (nation) {
        case "AH":
          return "flags/ah.svg";
        case "IT":
          return "flags/it.svg";
        case "FR":
          return "flags/fr.svg";
        case "GB":
          return "flags/gb.svg";
        case "GE":
          return "flags/ge.svg";
        case "RU":
          return "flags/ru.svg";
      }
    },
    tickWithAction: function (action) {
      if (action.type === "rondel" && action.payload.slot === "import") {
        this.importStatus.active = true;
        this.setImportProvinces(
          this.game.board.byNation.get(action.payload.nation)
        );
      }
      if (action.type === "rondel" && action.payload.slot === "investor") {
        this.purchasingBond = true;
      }
      if (action.type === "bondPurchase") {
        this.purchasingBond = false;
      }
      if (action.type === "rondel" && action.payload.slot === "factory") {
        this.buildingFactory = true;
      }
      if (action.type === "buildFactory") {
        this.buildingFactory = false;
      }
      this.removeFlagFromAllRondelSlots();
      this.game.tick(action);
      this.addFlagToRondel();
      this.removeHighlightsFromRondel();
      this.addHighlightsToRondel();
      this.updateUnits();
      if (
        action.type === "rondel" &&
        (action.payload.slot === "maneuver1" ||
          action.payload.slot === "maneuver2")
      ) {
        this.maneuverStatus.active = true;
        this.highlightManeuverProvinces(this.game.availableActions);
        this.prepareDestinations(this.game.availableActions);
      }
      if (action.type === "maneuver") {
        const el = document.getElementById(action.payload.origin);
        el.removeAttribute("filter");
      }
    },
    actionToText: function (action) {
      if (action.type === "rondel") {
        return action.payload.slot;
      } else if (action.type === "buildFactory") {
        return `Build factory in ${action.payload.province}`;
      } else if (action.type === "bondPurchase") {
        return `Purchase a ${action.payload.nation.value} bond for ${action.payload.cost}`;
      } else if (action.type === "endManeuver") {
        return `End maneuver`;
      } else if (action.type === "coexist") {
        return `Coexist`;
      } else if (action.type === "fight") {
        return `Fight`;
      }
    },
    updateUnits: function () {
      [...document.getElementsByClassName("unit")].forEach((e) => e.remove());

      for (const [nation, _] of this.game.units) {
        for (const [province, { armies, fleets }] of this.game.units.get(
          nation
        )) {
          if (armies > 0) {
            const target = document.getElementById(province);
            const army = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "image"
            );
            const x = (
              parseInt(target.lastElementChild.getAttribute("x")) - 20
            ).toString();
            const y = (
              parseInt(target.lastElementChild.getAttribute("y")) + 3
            ).toString();
            army.setAttribute("x", x);
            army.setAttribute("y", y);
            army.setAttribute("class", "unit");
            army.setAttribute("height", "8");
            army.setAttribute("href", this.flag(nation.value));

            target.append(army);
          }
          if (fleets > 0) {
            const target = document.getElementById(province);
            const fleet = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "image"
            );
            const x = (
              parseInt(target.lastElementChild.getAttribute("x")) - 20
            ).toString();
            const y = (
              parseInt(target.lastElementChild.getAttribute("y")) + 3
            ).toString();
            fleet.setAttribute("x", x);
            fleet.setAttribute("y", y);
            fleet.setAttribute("class", "unit");
            fleet.setAttribute("height", "0.5rem");
            fleet.setAttribute("href", this.flag(nation.value));

            target.append(fleet);
          }
        }
      }
    },
    removeFlagFromAllRondelSlots: function () {
      for (const [nation, { rondelPosition }] of this.game.nations) {
        if (rondelPosition === null) continue;
        this.removeFlagFromRondelSlot(nation.value);
      }
    },
    removeFlagFromRondelSlot: function (nation) {
      if (document.getElementById(`${nation}_flag`)) {
        document.getElementById(`${nation}_flag`).remove();
        this.removeFlagFromRondelSlot(nation);
      }
    },
    addFlagToRondel: function () {
      for (const [nation, { rondelPosition }] of this.game.nations) {
        if (rondelPosition === null) continue;
        const el = document.getElementById(rondelPosition);
        const bBox = el.getBBox();
        const flag = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "image"
        );
        flag.setAttribute("height", "20");
        flag.setAttribute("id", `${nation.value}_flag`);

        // This is a really rough way to get the center of the SVG path
        const step = el.getTotalLength() / 100;
        let totalX = 0;
        let totalY = 0;
        for (let dist = 0; dist < el.getTotalLength(); dist += step) {
          const pt = el.getPointAtLength(dist);
          totalX += pt.x;
          totalY += pt.y;
        }

        flag.setAttribute("x", totalX / 100);
        flag.setAttribute("y", totalY / 100);

        flag.setAttribute("href", this.flag(nation.value));
        el.parentNode.append(flag);
      }
    },
    addHighlightsToRondel: function () {
      for (const action of this.game.availableActions) {
        if (action.type === "rondel") {
          const slot = document.getElementById(action.payload.slot);
          slot.addEventListener("mouseenter", this.darken);
          slot.addEventListener("mouseleave", (event) => {
            event.target.removeAttribute("filter");
          });
          slot.addEventListener("click", this.tickWithEvent);
        }
      }
    },
    tickWithEvent: function (event) {
      for (const action of this.game.availableActions) {
        if (event.target.id === action.payload.slot) {
          this.tickWithAction(action);
        }
      }
    },
    removeHighlightsFromRondel: function () {
      [
        "factory",
        "production1",
        "maneuver1",
        "investor",
        "import",
        "production2",
        "maneuver2",
        "taxation",
      ].forEach((slot) => {
        const slotElement = document.getElementById(slot);
        slotElement.removeEventListener("mouseenter", this.darken);
        slotElement.removeEventListener("click", this.tickWithEvent);
      });
    },
    darken: function (event) {
      event.target.setAttribute("filter", "brightness(0.8)");
    },
    setImportProvinces: function (provinces) {
      for (const province of provinces) {
        const el = document.getElementById(province);
        el.addEventListener("click", this.prepareImport);
      }
    },
    prepareImport: function (event) {
      event.target.parentNode.children[1].setAttribute(
        "filter",
        "brightness(0.8)"
      );
      this.importStatus.targets.push(event.target);
      this.importStatus.placements.push(event.target.parentNode.id);
    },
    runImport: function () {
      for (const { payload } of this.game.availableActions) {
        const allowedCombo = payload.placements.map(({ province }) => province);
        const allPlacementsAreAllowed = allowedCombo.sort().every((item) => {
          return this.importStatus.placements.includes(item);
        });
        if (
          allowedCombo.length === this.importStatus.placements.length &&
          allPlacementsAreAllowed
        ) {
          this.importStatus.active = false;
          this.tickWithAction(Action.import(payload));
          this.importStatus.placements = [];
          this.importStatus.targets.forEach((target) => {
            target.parentNode.children[1].removeAttribute("filter");
          });
          this.importStatus.targets = [];
          return;
        }
      }

      this.importStatus.placements = [];
      this.importStatus.targets.forEach((target) => {
        target.parentNode.children[1].removeAttribute("filter");
      });
      this.importStatus.targets = [];
    },
    highlightManeuverProvinces: function (availableActions) {
      for (const { payload } of availableActions) {
        if (payload === undefined) continue;
        const origin = document.getElementById(payload.origin);
        origin.setAttribute("filter", "brightness(0.8)");
        origin.addEventListener("click", this.prepareManeuver);
      }
    },
    prepareDestinations: function (availableActions) {
      for (const { payload } of availableActions) {
        if (payload === undefined) continue;
        const el = document.getElementById(payload.origin);
      }
    },
    prepareManeuver: function (event) {
      this.maneuverStatus.origin = event.target.parentNode.id;
      for (const { payload } of this.game.availableActions) {
        if (payload === undefined) continue;
        if (payload.origin === event.target.parentNode.id) {
          const destination = document.getElementById(payload.destination);
          destination.addEventListener("click", this.submitManeuver);
        }
      }
    },
    submitManeuver: function (event) {
      const proposedAction = Action.maneuver({
        origin: this.maneuverStatus.origin,
        destination: event.target.parentNode.id,
      });

      if (this.game.availableActions.has(proposedAction)) {
        this.tickWithAction(proposedAction);
        this.maneuverStatus.active = false;
        this.maneuverStatus.origin = "";
      }
    },
    endManeuver: function (action) {
      this.tickWithAction(action);
      this.maneuverStatus.active = false;
      this.maneuverStatus.origin = "";
    },
  },
});
