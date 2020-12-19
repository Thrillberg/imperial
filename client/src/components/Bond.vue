<template>
  <span class="bond">{{ nation }}{{ cost }}</span>
</template>

<script>
export default {
  name: "Bond",
  props: {
    cost: Number,
    nation: String
  }
};
</script>
