<template>
  <div class="p-2 m-1 border border-gray-500" :class="player.name === current_player ? 'bg-green-300' : ''">
    <p>
      <span
        v-if="online_users.includes(player.name)"
        class="h-2 w-2 bg-blue-700 border-blue-700 border-2 rounded-full inline-block"
      >
      </span>
      <b>{{ player.name }}</b>
    </p>
    <span v-if="player.name === profile.username || game.soloMode">Cash: {{ player.cash }}m</span>
    <div>Raw score: {{ player.rawScore }}</div>
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
    online_users: Array,
    player: Object,
    profile: Object,
    game: Object,
    name: String
  }
};
</script>
