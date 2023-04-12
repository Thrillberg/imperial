<template>
  <v-container>
    <v-sheet
      width="500"
      class="mx-auto"
    >
      <v-form @submit="openGame">
        <b>Which base game?</b>
        <v-radio-group v-model="baseGame">
          <v-radio
            label="Original Imperial"
            value="imperial"
          />
          <v-radio
            label="Imperial 2030"
            value="imperial2030"
          />
          <v-radio
            label="Imperial Asia"
            value="imperialAsia"
          />
        </v-radio-group>
        <b>Which variant?</b>
        <v-radio-group v-model="variant">
          <v-radio
            label="Standard (with investor card, no auction)"
            value="standard"
          />
          <v-radio
            label="Auction (with investor card and auction)"
            value="auction"
          />
          <v-radio
            label="Without Investor Card (with auction, no investor card)"
            value="withoutInvestorCard"
          />
        </v-radio-group>
        <b>Is your game public or private?</b>
        <div class="text-sm">
          Public games are listed on the Open Games list.
          Private games can only be joined with the game link.
        </div>
        <v-radio-group v-model="isGamePublic">
          <v-radio
            label="Public"
            :value="true"
          />
          <v-radio
            label="Private"
            :value="false"
          />
        </v-radio-group>
        <b>Do You Want a Discord Channel to Automatically be Created?</b>
        (Optional)
        <v-radio-group v-model="createDiscordChannel">
          <v-radio
            label="Yes"
            :value="true"
          />
          <v-radio
            label="No"
            :value="false"
          />
        </v-radio-group>
        <v-btn type="submit">
          New Game
        </v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
import { apiClient } from '../router/index';

export default {
  name: 'NewGame',
  emits: ['openGame'],
  data() {
    return {
      baseGame: 'imperial',
      createDiscordChannel: false,
      isGamePublic: true,
      variant: 'standard',
    };
  },
  created() {
    document.title = 'New Game - Imperial';
  },
  methods: {
    openGame(e) {
      e.preventDefault();
      apiClient.openGame(
        this.$cookies.get('user_id'),
        this.baseGame,
        this.variant,
        this.createDiscordChannel,
        this.isGamePublic,
      )
        .then((game) => {
          this.$emit('openGame', game);
          this.$router.push(`/game/${game.id}`);
        });
    },
  },
};
</script>
