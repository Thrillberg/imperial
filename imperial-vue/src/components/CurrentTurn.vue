<template>
  <div>{{ type }}{{ payload }}</div>
</template>

<script>
export default {
  name: "CurrentTurn",
  props: {
    type: String,
    payload: String,
  },
};
</script>
