<template>
  <v-dialog
    v-model="dialog"
    width="50%"
  >
    <template #activator="{ props }">
      <v-btn
        color="primary"
        v-bind="props"
      >
        Available bonds
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Available Bonds</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="bond of game.availableBonds"
            :key="bond.nation+bond.cost"
          >
            <Bond
              :bond="bond"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary-darken-1"
          block
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Bond from './Bond.vue';

export default {
  name: 'AvailableBonds',
  components: { Bond },
  props: { game: { type: Object, default: () => {} } },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
