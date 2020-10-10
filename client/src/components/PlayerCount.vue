<template>
  <button v-on:click="start_game(count)">{{ count }} players</button>
</template>

<script>
export default {
  name: "Bond",
  props: {
    count: Number,
    start_game: Function,
  },
};
</script> 