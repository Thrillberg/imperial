<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    v-bind:width="width"
    v-bind:height="height"
    v-bind:transform="transform"
  >
    <g v-bind:clip-path="this.fleet ? 'url(#fleetClip)' : ''">
      <rect fill="#fff" width="1500" height="500" />
      <rect fill="#d52b1e" y="666" width="1500" height="666" />
      <rect fill="#0039a6" y="333" width="1500" height="333" />
    </g>
  </svg>
</template>

<script>
export default {
  name: "RUFlag",
  props: {
    fleet: Boolean,
    width: String,
    height: String,
    transform: String,
  },
};
</script>
