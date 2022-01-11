<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    :width="width"
    :height="height"
  >
    <filter id="grayscale">
      <feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0
                                           0.3333 0.3333 0.3333 0 0
                                           0.3333 0.3333 0.3333 0 0
                                           0      0      0      1 0"/>
    </filter>
    <g
    v-bind:clip-path="this.fleet ? 'url(#fleetClip)' : ''" :filter="activeFilter"
    >
      <path fill="#fd1" d="M0 0h1500v1000H0z" />
      <path fill="#000" d="M0 0h15000v500H0z" />
    </g>
  </svg>
</template>

<script>
export default {
  name: "AHFlag",
  props: {
    activeFilter: String,
    fleet: Boolean,
    width: String,
    height: String,
    transform: String
  }
};
</script>
