<template>
  <form
    class="flex flex-col mx-auto rounded bg-green-200 max-w-4xl mt-10 p-20"
    @submit="openGame"
  >
    <div class="max-w-2xl self-center">
      <div class="my-2">
        <b>Original Imperial or Imperial 2030</b>
        <div>
          <input type="radio" id="imperial" value="imperial" v-model="baseGame" />
          <label for="imperial">Original Imperial</label>
        </div>
        <div>
          <input type="radio" id="imperial2030" value="imperial2030" v-model="baseGame" />
          <label for="imperial2030">Imperial 2030</label>
        </div>
      </div>
      <div class="my-2">
        <b>Variant</b>
        <div>
          <input type="radio" id="standard" value="standard" v-model="variant" />
          <label for="standard">Standard (with investor card, no auction)</label>
        </div>
        <div>
          <input type="radio" id="auction" value="auction" v-model="variant" />
          <label for="auction">Auction (with investor card and auction)</label>
        </div>
        <div>
          <input type="radio" id="withoutInvestorCard" value="withoutInvestorCard" v-model="variant" />
          <label for="withoutInvestorCard">Without Investor Card (with auction, no investor card</label>
        </div>
      </div>
      <div class="my-2">
        <input
          type="submit"
          value="New Game"
          class="rounded p-5 bg-green-800 text-white cursor-pointer my-2 text-1xl w-1/2 self-center"
        />
      </div>
    </div>
  </form>
</template>

<script>
import { apiClient } from "../router/index.js";

export default {
  name: "NewGame",
  data() {
    return {
      baseGame: "imperial",
      variant: "standard"
    }
  },
  methods: {
    openGame(e) {
      e.preventDefault();
      apiClient.openGame(this.$cookies.get("user_id"), this.baseGame, this.variant)
        .then(game => {
          this.$emit("openGame", game);
          this.$router.push(`/game/${game.id}`);
        });
    }
  }
}
</script>
