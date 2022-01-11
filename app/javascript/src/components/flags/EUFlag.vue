<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    :width="width"
    :height="height"
  >
    <g
    v-bind:clip-path="this.fleet ? 'url(#fleetClip)' : ''" :filter="activeFilter"
    >
    <g
       id="s">
      <g
         id="c">
        <path
           id="t"
           d="M0,0v1h0.5z"
           transform="translate(0,-1)rotate(18)" />
        <use
           xlink:href="#t"
           transform="scale(-1,1)"
           id="use74" />
      </g>
      <g
         id="a">
        <use
           xlink:href="#c"
           transform="rotate(72)"
           id="use77" />
        <use
           xlink:href="#c"
           transform="rotate(144)"
           id="use79" />
      </g>
      <use
         xlink:href="#a"
         transform="scale(-1,1)"
         id="use82" />
    </g>
  <rect
     fill="#003399"
     width="1500"
     height="1000"
     id="rect87"
     x="0"
     y="0"
     style="stroke-width:1.85185" />
  <g
     fill="#ffcc00"
     transform="matrix(55.555556,0,0,55.555556,750,500)"
     id="g106">
    <use
       xlink:href="#s"
       y="-6"
       id="use89"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#s"
       y="6"
       id="use91"
       x="0"
       width="100%"
       height="100%" />
    <g
       id="l">
      <use
         xlink:href="#s"
         x="-6"
         id="use93"
         y="0"
         width="100%"
         height="100%" />
      <use
         xlink:href="#s"
         transform="rotate(-144,-2.3441661,-2.1106967)"
         id="use95"
         x="0"
         y="0"
         width="100%"
         height="100%" />
      <use
         xlink:href="#s"
         transform="rotate(144,-2.1106967,-2.3441661)"
         id="use97"
         x="0"
         y="0"
         width="100%"
         height="100%" />
      <use
         xlink:href="#s"
         transform="rotate(72,-4.6626491,-2.0759451)"
         id="use99"
         x="0"
         y="0"
         width="100%"
         height="100%" />
      <use
         xlink:href="#s"
         transform="rotate(72,-5.0759451,0.53350333)"
         id="use101"
         x="0"
         y="0"
         width="100%"
         height="100%" />
    </g>
    <use
       xlink:href="#l"
       transform="scale(-1,1)"
       id="use104"
       x="0"
       y="0"
       width="100%"
       height="100%" />
  </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: "EUFlag",
  props: {
    activeFilter: String,
    fleet: Boolean,
    width: String,
    height: String,
    transform: String
  }
};
</script>
