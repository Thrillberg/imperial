<template>
  <div>
    <form
      class="flex flex-col mx-auto rounded bg-green-200 sm:max-w-4xl mt-10 sm:p-20"
      @submit="importGame"
    >
      <textarea
        v-model="gameLog"
        class="rounded p-5 border border-green-800 my-2 sm:w-full self-center"
      />
      <input
        type="submit"
        value="Import game"
        class="rounded p-5 bg-green-800 text-white cursor-pointer my-2 text-2xl sm:w-1/2 self-center"
      >
    </form>
  </div>
</template>

<script>
export default {
  name: 'ImportGame',
  props: {
    profile: { type: Object, default: () => {} },
  },
  data() {
    return {
      gameLog: '',
    };
  },
  created() {
    document.title = 'Import - Imperial';
  },
  methods: {
    importGame(e) {
      fetch(`${import.meta.env.VITE_API_URL}/imports`, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': this.$cookies.get('CSRF-TOKEN'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ log: this.gameLog, hostId: this.profile.id }),
      })
        .then((response) => response.json())
        .then((game) => {
          this.$router.push(`/game/${game.id}`);
        });
      e.preventDefault();
    },
  },
};
</script>
