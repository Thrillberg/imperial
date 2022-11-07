<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1000"
    height="700"
  >
    <rect
      fill="#fff"
      height="700"
      width="1000"
    />
    <circle
      fill="#b0313f"
      cx="490"
      cy="350"
      r="210"
    />
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
