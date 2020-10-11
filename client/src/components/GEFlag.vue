<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    v-bind:width="width"
    v-bind:height="height"
    v-bind:transform="transform"
  >
    <path d="M0 0h900v600H0z" />
    <path d="M0 200h900v400H0z" fill="#fff" />
    <path d="M0 400h900v200H0z" fill="#d00" />
  </svg>
</template>

<script>
export default {
  name: "GEFlag",
  props: {
    width: String,
    height: String,
    transform: String,
  },
};
</script>