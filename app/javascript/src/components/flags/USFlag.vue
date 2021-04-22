<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    :width="width"
    :height="height"
  >
    <g v-bind:clip-path="this.fleet ? 'url(#fleetClip)' : ''">
  <rect
     width="1900"
     height="1000"
     fill="#b22234"
     id="rect338"
     x="0"
     y="0"
     style="stroke-width:0.25641" />
  <path
     d="m 0,115.3846 h 1900 m 0,153.8462 H 0 m 0,153.8461 h 1900 m 0,153.8462 H 0 m 0,153.8461 h 1900 m 0,153.8462 H 0"
     stroke="#ffffff"
     stroke-width="76.9231"
     id="path340" />
  <rect
     width="760"
     height="538.46155"
     fill="#3c3b6e"
     id="rect342"
     x="0"
     y="0"
     style="stroke-width:0.25641" />
  <g
     fill="#ffffff"
     id="g367"
     transform="scale(0.25641026)">
    <g
       id="s18">
      <g
         id="s9">
        <g
           id="s5">
          <g
             id="s4">
            <path
               id="s"
               d="M 247,90 317.53423,307.08204 132.87322,172.91796 H 361.12678 L 176.46577,307.08204 Z" />
            <use
               xlink:href="#s"
               y="420"
               id="use345"
               x="0"
               width="100%"
               height="100%" />
            <use
               xlink:href="#s"
               y="840"
               id="use347"
               x="0"
               width="100%"
               height="100%" />
            <use
               xlink:href="#s"
               y="1260"
               id="use349"
               x="0"
               width="100%"
               height="100%" />
          </g>
          <use
             xlink:href="#s"
             y="1680"
             id="use352"
             x="0"
             width="100%"
             height="100%" />
        </g>
        <use
           xlink:href="#s4"
           x="247"
           y="210"
           id="use355"
           width="100%"
           height="100%" />
      </g>
      <use
         xlink:href="#s9"
         x="494"
         id="use358"
         y="0"
         width="100%"
         height="100%" />
    </g>
    <use
       xlink:href="#s18"
       x="988"
       id="use361"
       y="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#s9"
       x="1976"
       id="use363"
       y="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#s5"
       x="2470"
       id="use365"
       y="0"
       width="100%"
       height="100%" />
  </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: "USFlag",
  props: {
    fleet: Boolean,
    width: String,
    height: String,
    transform: String
  }
};
</script>
