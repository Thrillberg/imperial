<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    v-bind:width="width"
    v-bind:height="height"
    v-bind:transform="transform"
  >
    <g v-bind:clip-path="this.fleet ? 'url(#fleetClip)' : ''">
      <rect width="1500" height="1000" fill="#CE1126" />
      <rect width="1000" height="1000" fill="#FFFFFF" />
      <rect width="500" height="1000" fill="#002654" />
    </g>
  </svg>
</template>

<script>
export default {
  name: "FRFlag",
  props: {
    fleet: Boolean,
    width: String,
    height: String,
    transform: String,
  },
};
</script>