<template>
  <div
    class="p-2 m-1 bg-green-200 font-serif"
    :class="player.name === current_player ? 'font-bold' : ''"
  >
    <h3>{{ player.name }}</h3>
    <div class="flex flex-wrap">
      <div v-for="nation of nationsWithInvestment()" :key="nation.value">
        <Bond
          v-for="bond in player.bonds"
          :bond="bond"
          :nation="nation.value"
          :key="bond.nation.value + bond.cost"
        />
      </div>
    </div>
    <div v-if="player.name === game.investorCardHolder">Investor Card</div>
    <div v-if="game.swissBanks.includes(player.name)">Swiss Bank</div>
  </div>
</template>

<script>
import Bond from "./Bond.vue";

export default {
  name: "Player",
  components: {
    Bond
  },
  props: {
    current_player: String,
    player: Object,
    game: Object,
    name: String
  },
  methods: {
    nationsWithInvestment: function () {
      let nations = new Set();
      for (const [nation] of this.game.nations) {
        for (const bond of this.player.bonds) {
          if (bond.nation === nation) {
            nations.add(nation);
          }
        }
      }
      return nations;
    }
  }
};
</script>
