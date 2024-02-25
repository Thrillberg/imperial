<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-text>
        <v-form @submit="openGame">
          <b>Which base game?</b>
          <v-radio-group v-model="baseGame">
            <v-row align="center">
              <v-col :cols="mdAndUp ? '4' : '12'">
                <Board
                  :config="boardConfigs.imperial"
                  :game="defaultLatestStateImperial"
                />
                <v-radio
                  label="Imperial (Classic)"
                  value="imperial"
                />
                <v-radio
                  label="Imperial (2030 Rules)"
                  value="imperialEurope2030"
                />
              </v-col>
              <v-col :cols="mdAndUp ? '4' : '12'">
                <Board
                  :config="boardConfigs.imperial2030"
                  :game="defaultLatestStateImperial"
                />
                <v-radio
                  label="Imperial 2030"
                  value="imperial2030"
                />
              </v-col>
              <v-col :cols="mdAndUp ? '4' : '12'">
                <Board
                  :config="boardConfigs.imperialAsia"
                  :game="defaultLatestStateImperial"
                />
                <v-radio
                  label="Imperial Asia"
                  value="imperialAsia"
                />
              </v-col>
            </v-row>
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
          <b>What level of time commitment should players expect? </b>
          <v-radio-group v-model="timeCommitment">
            <v-radio
              label="Infinite (no speed commitment)"
              value="infinite"
            />
            <v-radio
              label="Slow Async (1 move every other day)"
              value="slow"
            />
            <v-radio
              label="Async (1 move per day)"
              value="async"
            />
            <v-radio
              label="Live, Fast Async (2+ moves per day)"
              value="live"
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
          <v-btn
            color="primary-darken-1"
            type="submit"
          >
            New Game
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { useDisplay } from 'vuetify';
import Board from '../components/Board.vue';
import { apiClient } from '../router/index';
import { defaultLatestState } from '../translateToGameData';

export default {
  name: 'NewGame',
  components: { Board },
  emits: ['openGame'],
  async setup() {
    const { mdAndUp } = useDisplay();
    const boardConfigs = {};
    await import('../boardConfigs').then((resp) => { boardConfigs.imperial = resp.default.imperial; });
    await import('../board2030Configs').then((resp) => { boardConfigs.imperial2030 = resp.default.imperial2030; });
    await import('../boardAsiaConfigs').then((resp) => { boardConfigs.imperialAsia = resp.default.imperialAsia; });
    return { boardConfigs, mdAndUp };
  },
  data() {
    return {
      baseGame: 'imperial',
      createDiscordChannel: false,
      isGamePublic: true,
      timeCommitment: 'infinite',
      variant: 'standard',
    };
  },
  computed: {
    defaultLatestStateImperial() {
      return defaultLatestState('imperial');
    },
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
        this.timeCommitment,
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
