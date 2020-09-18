import Imperial from "./imperial.js";
import Action from "./action.js";
import { Nation } from "./constants.js";

Vue.component("board", {
  props: ["board"],
  template: `<div v-html="board"></div>`,
});

Vue.component("player", {
  props: ["name", "cash", "bonds", "current_player"],
  template: `
  <li class="player">
    <div v-if="name === current_player" class="current_player">
      🤩
      <flag v-bind:nation="'Nation.AH'"></flag>
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

Vue.component("player-count", {
  props: ["count", "start_game"],
  template: `<button v-on:click="start_game(count)">{{ count }} players</button>`,
});

Vue.component("flag", {
  props: ["nation"],
  data: function () {
    return {
      svg: {
        [Nation.AH]: `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewbox="0 0 900 600"><path fill="#fd1" d="M0 0h900v600H0z"/><path d="M0 0h900v300H0z"/></svg>`,
        [Nation.IT]: `<svg height="1000" width="1500" xmlns="http://www.w3.org/2000/svg"><g stroke-width="500"><path d="m0 0h1500v1000h-1500z" fill="#009246"/><path d="m500 0h1000v1000h-1000z" fill="#fff"/><path d="m1000 0h500v1000h-500z" fill="#ce2b37"/></g><path d="m576.98052 288.08032h346.03959v413.57484h-346.03959z" fill="#d2232c"/><path d="m723.2952 288.08032h53.41024v413.57484h-53.41024z" fill="#fff"/><path d="m923.02011 460.81767v53.41023h-346.03959v-53.41023z" fill="#fff"/><path d="m512.262 245.35213c0 .00001 21.48928 18.68683 21.48928 55.93471v350.62991c0 51.90847 39.00294 80.24047 79.25996 80.24047h105.69385c26.64703 0 31.29506 22.49065 31.29506 22.49078 0-.00007 4.64803-22.49078 31.29506-22.49078h105.69386c40.25702 0 79.25997-28.33193 79.25997-80.24047v-350.62991c0-37.24788 21.48927-55.9347 21.48927-55.93471zm71.39447 49.40447h332.68737v345.41403c-.00006 22.57023-8.76188 40.12017-36.21882 40.1203h-100.29025c-20.66215 0-29.83462 14.68782-29.83462 14.68782s-9.17247-14.68782-29.83462-14.68782h-100.29024c-27.45695-.0002-36.21876-17.55007-36.21882-40.1203z" fill="#4b61d1" fill-rule="evenodd"/></svg>`,
      }[this.nation],
    };
  },
  template: `<div style="width: 100px; height: 50px" v-html="svg"></div>`,
});

Vue.component("rondel-slot", {
  props: ["rondel_slot", "index", "select_slot"],
  template: `
  <g v-bind:transform="'translate(0, ' + 51 * index + ')'">
    <rect
      v-bind:id="rondel_slot.type"
      v-bind:fill="rondel_slot.color"
      v-on:click="select_slot(rondel_slot)"
      x="0" y="0" width="200" height="50">
    </rect>
    <text
      font-family="Baskerville" font-size="24" font-weight="normal"
      letter-spacing="0.61714304"
      fill="#000000"
      text-align="center"
    >
        <tspan x="0" y="25" width="200">{{ rondel_slot.label }}</tspan>
    </text>
    <flag v-bind:nation="'AH'"></flag>
  </g>
  `,
});

Vue.component("rondel", {
  // The rondel is a circle segmented into eight slices, each of which
  // corresponds to the action a nation can take on a turn. Selecting a segment
  // triggers an action of type "rondel". Each nation's flag is displayed
  // on the segment corresponding to the action it last took.
  props: ["game", "dispatch"],
  data: () => ({
    rondelSlots: [
      { type: "import", label: "Import", color: "#F39D81" },
      { type: "production2", label: "Production", color: "#8C8798" },
      { type: "maneuver2", label: "Maneuver", color: "#7EA850" },
      { type: "taxation", label: "Taxation", color: "#FFD281" },
      { type: "factory", label: "Factory", color: "#8DBCFB" },
      { type: "production1", label: "Production", color: "#8C8798" },
      { type: "maneuver1", label: "Maneuver", color: "#7EA850" },
      { type: "investor", label: "Investor", color: "#8EDFFF" },
    ],
  }),
  methods: {
    selectSlot: function (slot) {
      // Look through the available actions for this particular board state.
      for (const action of this.game.availableActions) {
        // If an action corresponding to the selected slot is available, then
        // dispatch the available action.
        if (slot.type === action.payload.slot) {
          this.dispatch(action);
        }
      }
    },
  },
  template: `
  <svg
    width="470px" height="456px"
    viewBox="0 0 470 456"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
      <rondel-slot
        v-for="(slot, index) in rondelSlots"
        v-bind:rondel_slot="slot"
        v-bind:index="index"
        v-bind:select_slot="selectSlot"
      ></rondel-slot>
  </svg>
  `,
});

var app = new Vue({
  el: "#app",
  data: {
    board: "",
    buildingFactory: false,
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
    purchasingBond: false,
    playerCounts: [2, 3, 4, 5, 6],
  },
  mounted() {
    fetch("board.svg")
      .then((response) => response.text())
      .then((text) => {
        this.board = text;
      });

    this.startGame(6); // TEST
  },
  methods: {
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
      this.game.tick(action);
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
      if (action.type === "buildFactory") {
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
    tickWithEvent: function (event) {
      for (const action of this.game.availableActions) {
        if (event.target.id === action.payload.slot) {
          this.tickWithAction(action);
        }
      }
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
