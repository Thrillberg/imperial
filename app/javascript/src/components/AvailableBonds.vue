<template>
  <div>
    <button
      class="rounded py-2 px-6 m-4 bg-green-800 text-white cursor-pointer"
      v-if="!showBonds"
      @click="showBonds = true"
    >
      Show available bonds
    </button>
    <button
      class="rounded py-2 px-6 m-4 bg-green-800 text-white cursor-pointer"
      v-if="showBonds"
      @click="showBonds = false"
    >
      Hide available bonds
    </button>
    <div class="flex flex-wrap" v-if="showBonds">
      <div v-for="bond of game.availableBonds" :key="bond.nation+bond.cost">
        <Bond
          :bond="bond"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Bond from "../components/Bond.vue";

export default {
  name: "AvailableBonds",
  components: { Bond },
  props: { game: Object },
  data: () => ({ showBonds: false })
}
</script>
