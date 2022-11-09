<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1017.9106 508.95532"
    :width="width"
    :height="height"
  >
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path
        d="m 30,15 h 30 v 15 z m 0,0 V 30 H 0 Z m 0,0 H 0 V 0 Z m 0,0 V 0 h 30 z"
      />
    </clipPath>
    <mask id="gbFleetMask">
      <circle
        style="fill: #ebe084; stroke-width: 0.00662628"
        cx="30.061579"
        cy="15.089733"
        r="14.971845"
      />
    </mask>
    <g
      clip-path="url(#s)"
      :mask="fleet ? 'url(#gbFleetMask)' : ''"
      transform="matrix(20,0,0,20,-91.044684,-45.522345)"
    >
      <path
        d="M 0,0 V 30 H 60 V 0 Z"
        fill="#012169"
      />
      <path
        d="M 0,0 60,30 M 60,0 0,30"
        stroke="#ffffff"
        stroke-width="6"
      />
      <path
        d="M 0,0 60,30 M 60,0 0,30"
        clip-path="url(#t)"
        stroke="#c8102e"
        stroke-width="4"
      />
      <path
        d="M 30,0 V 30 M 0,15 h 60"
        stroke="#ffffff"
        stroke-width="10"
      />
      <path
        d="M 30,0 V 30 M 0,15 h 60"
        stroke="#c8102e"
        stroke-width="6"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'GBFlag',
  props: {
    fleet: Boolean,
    width: String,
    height: String,
    transform: String,
  },
};
</script>
