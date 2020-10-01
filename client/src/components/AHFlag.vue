<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    v-bind:width="width"
    v-bind:height="height"
    v-bind:transform="transform"
  >
    <path fill="#fd1" d="M0 0h900v600H0z" />
    <path fill="#000" d="M0 0h900v300H0z" />
  </svg>
</template>

<script>
export default {
  name: "AHFlag",
  props: {
    width: String,
    height: String,
    transform: String,
  },
};
</script>