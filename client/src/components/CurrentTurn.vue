<template>
  <div>{{ type }}{{ payload }}</div>
</template>

<script>
export default {
  name: "CurrentTurn",
  props: {
    payload: Object,
    type: String,
  },
};
</script>