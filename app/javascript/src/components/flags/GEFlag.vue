<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    :width="width"
    :height="height"
  >
    <g v-bind:clip-path="this.fleet ? 'url(#fleetClip)' : ''">
      <path d="M0 0h1500v1000H0z" />
      <path d="M0 333h1500v666H0z" fill="#fff" />
      <path d="M0 666h1500v333H0z" fill="#d00" />
    </g>
  </svg>
</template>

<script>
export default {
  name: "GEFlag",
  props: {
    fleet: Boolean,
    width: String,
    height: String,
    transform: String
  }
};
</script>
