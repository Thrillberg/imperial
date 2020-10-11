<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    v-bind:width="width"
    v-bind:height="height"
    v-bind:transform="transform"
  >
    <rect width="900" height="600" fill="#CE1126" />
    <rect width="600" height="600" fill="#FFFFFF" />
    <rect width="300" height="600" fill="#002654" />
  </svg>
</template>

<script>
export default {
  name: "FRFlag",
  props: {
    width: String,
    height: String,
    transform: String,
  },
};
</script>