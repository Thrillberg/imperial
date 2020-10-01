<template>
  <li class="bond">{{ nation }}{{ cost }}</li>
</template>

<script>
export default {
  name: "Bond",
  props: {
    cost: Number,
    nation: String,
  },
};
</script>