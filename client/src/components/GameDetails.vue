<template>
  <div>
    <div class="flex">
      <Player
        v-for="player in game.players"
        v-bind:player="player"
        v-bind:current_player="controllingPlayerName"
        v-bind:game="game"
        v-bind:key="player.name"
      ></Player>
    </div>
    <div class="flex">
      <div class="flex justify-around p-4 border border-gray-500 rounded">
        <NationComponent
          v-for="[nation] of game.nations"
          v-bind:current_nation="
            game.currentNation === nation ? 'current_nation' : ''
          "
          v-bind:nation="nation.value"
          v-bind:treasury="game.nations.get(nation).treasury"
          v-bind:power_points="game.nations.get(nation).powerPoints"
          v-bind:tax_chart_position="game.nations.get(nation).taxChartPosition"
          v-bind:key="nation.value"
        ></NationComponent>
      </div>
    </div>
  </div>
</template>

<script>
import NationComponent from "@/components/NationComponent.vue";
import Player from "@/components/Player.vue";

export default {
  name: "GameDetails",
  components: {
    NationComponent,
    Player
  },
  props: ["game", "controllingPlayerName"],
  methods: {
    powerPoints() {
      return [...Array(26).keys()].map(slot => {
        let nations = [];
        for (const [nation, data] of this.game.nations) {
          if (data.powerPoints === slot) {
            nations.push(nation.value);
          }
        }
        return { slot, nations };
      });
    },
    taxes() {
      return [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5].map(slot => {
        let nations = [];
        for (const [nation, data] of this.game.nations) {
          if (data.taxChartPosition === slot) {
            nations.push(nation.value);
          }
        }
        return { slot, nations };
      });
    }
  }
};
</script>
