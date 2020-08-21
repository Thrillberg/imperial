<template>
  <li class="bond">{{ nation }}{{ cost }}</li>
</template>

<script>
export default {
  name: "Bond",
  props: {
    nation: String,
    cost: Number,
  },
};
</script>
