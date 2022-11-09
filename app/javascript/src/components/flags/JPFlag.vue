<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 1500 1000"
  >
    <g :clip-path="fleet ? 'url(#fleetClip)' : ''">
      <rect
        fill="#fff"
        height="1000"
        width="1500"
      />
      <circle
        fill="#b0313f"
        cx="750"
        cy="500"
        r="300"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'JPFlag',
  props: {
    activeFilter: { type: String, default: '' },
    fleet: Boolean,
    width: { type: String, default: '' },
    height: { type: String, default: '' },
    transform: { type: String, default: '' },
  },
};
</script>
