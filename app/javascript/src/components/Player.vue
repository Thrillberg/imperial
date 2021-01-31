<template>
  <div class="p-2 m-1 font-serif" :class="player.name === current_player ? 'bg-green-300' : 'bg-gray-300'">
    <span>{{ player.name }}</span>
    <span v-if="player.name === profile.username || game.soloMode"> - {{ player.cash }}m</span>
    <div class="flex flex-wrap">
      <Bond
        v-for="bond in player.bonds"
        :bond="bond"
        :key="bond.nation.value + bond.cost"
      />
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
    profile: Object,
    game: Object,
    name: String
  }
};
</script>
