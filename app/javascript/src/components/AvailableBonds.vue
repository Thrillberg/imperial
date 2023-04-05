<template>
  <v-btn
    v-if="!showBonds"
    color="primary"
    @click="showBonds = true"
  >
    Show available bonds
  </v-btn>
  <v-btn
    v-if="showBonds"
    color="primary"
    @click="showBonds = false"
  >
    Hide available bonds
  </v-btn>
  <div
    v-if="showBonds"
    class="flex flex-wrap"
  >
    <div
      v-for="bond of game.availableBonds"
      :key="bond.nation+bond.cost"
    >
      <Bond
        :bond="bond"
      />
    </div>
  </div>
</template>

<script>
import Bond from './Bond.vue';

export default {
  name: 'AvailableBonds',
  components: { Bond },
  props: { game: Object },
  data: () => ({ showBonds: false }),
};
</script>
