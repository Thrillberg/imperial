<template>
  <button v-on:click="dispatch(action)">{{ text }}</button>
</template>

<script>
export default {
  name: "Action",
  props: {
    action: Object,
    dispatch: Function,
    text: String,
  },
};
</script>
