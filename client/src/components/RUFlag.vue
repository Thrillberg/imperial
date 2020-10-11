<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 9 6"
    v-bind:width="width"
    v-bind:height="height"
    v-bind:transform="transform"
  >
    <rect fill="#fff" width="9" height="3" />
    <rect fill="#d52b1e" y="3" width="9" height="3" />
    <rect fill="#0039a6" y="2" width="9" height="2" />
  </svg>
</template>

<script>
export default {
  name: "RUFlag",
  props: {
    width: String,
    height: String,
    transform: String,
  },
};
</script>