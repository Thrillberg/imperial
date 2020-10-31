<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    v-bind:width="width"
    v-bind:height="height"
    v-bind:transform="transform"
  >
    <g v-bind:clip-path="this.fleet ? 'url(#fleetClip)' : ''">
      <path fill="#fd1" d="M0 0h1500v1000H0z" />
      <path fill="#000" d="M0 0h15000v500H0z" />
    </g>
  </svg>
</template>

<script>
export default {
  name: "AHFlag",
  props: {
    fleet: Boolean,
    width: String,
    height: String,
    transform: String,
  },
};
</script>
