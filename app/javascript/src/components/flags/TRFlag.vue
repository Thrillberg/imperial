<template>
  <!-- eslint-disable -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 1200 800"
  >
  <g :clip-path="fleet ? 'url(#fleetClipTR)' : ''">
    <rect
      width="1200"
      height="800"
      fill="#E30A17"
    />
    <circle
      cx="425"
      cy="400"
      r="225"
      style="fill:#ffffff"
    />
    <circle
      cx="500"
      cy="400"
      r="180"
      style="fill:#E30A17"
    />
    <path
      fill="#FFFFFF"
      d="m 589.05959,400.5279 72.2995,-27.03457 3.36962,-77.11504 48.05317,60.40677 74.38203,-20.62517 -42.601,64.368 42.60101,64.368 -74.38204,-20.62516 -48.05316,60.40677 -3.36963,-77.11505 z"
    />
  </g>
  </svg>
</template>

<script>
export default {
  name: 'TRFlag',
  props: {
    activeFilter: { type: String, default: '' },
    fleet: Boolean,
    width: { type: String, default: '' },
    height: { type: String, default: '' },
    transform: { type: String, default: '' },
  },
};
</script>
