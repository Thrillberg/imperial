<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    :width="width"
    :height="height"
  >
    <filter id="grayscale">
      <feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"/>
    </filter>
    <g
    v-bind:clip-path="this.fleet ? 'url(#fleetClip)' : ''" :filter="activeFilter"
    >
      <rect
         width="1500"
         fill="#ff9933"
         id="rect333"
         x="0.5"
         style="stroke-width:6.66667"
         height="1000"
         y="1" />
      <rect
         width="1500"
         height="333.33334"
         y="334.33331"
         fill="#ffffff"
         id="rect335"
         x="0.5"
         style="stroke-width:6.66667" />
      <rect
         width="1500"
         height="333.33334"
         y="667.66669"
         fill="#128807"
         id="rect337"
         x="0.5"
         style="stroke-width:6.66667" />
      <g
         transform="matrix(6.6666668,0,0,6.6666668,750.5,501)"
         id="g363">
        <circle
           r="20"
           fill="#000088"
           id="circle339"
           cx="0"
           cy="0" />
        <circle
           r="17.5"
           fill="#ffffff"
           id="circle341"
           cx="0"
           cy="0" />
        <circle
           r="3.5"
           fill="#000088"
           id="circle343"
           cx="0"
           cy="0" />
        <g
           id="d">
          <g
             id="c">
            <g
               id="b">
              <g
                 id="a">
                <circle
                   r="0.875"
                   fill="#000088"
                   transform="rotate(7.5,-8.75,133.4992)"
                   id="circle345"
                   cx="0"
                   cy="0" />
                <path
                   fill="#000088"
                   d="M 0,17.5 0.6,7 C 0.6,7 0,2 0,2 0,2 -0.6,7 -0.6,7 Z"
                   id="path347" />
              </g>
              <use
                 xlink:href="#a"
                 transform="rotate(15)"
                 id="use350"
                 x="0"
                 y="0"
                 width="100%"
                 height="100%" />
            </g>
            <use
               xlink:href="#b"
               transform="rotate(30)"
               id="use353"
               x="0"
               y="0"
               width="100%"
               height="100%" />
          </g>
          <use
             xlink:href="#c"
             transform="rotate(60)"
             id="use356"
             x="0"
             y="0"
             width="100%"
             height="100%" />
        </g>
        <use
           xlink:href="#d"
           transform="rotate(120)"
           id="use359"
           x="0"
           y="0"
           width="100%"
           height="100%" />
        <use
           xlink:href="#d"
           transform="rotate(-120)"
           id="use361"
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
  name: "INFlag",
  props: {
    activeFilter: String,
    fleet: Boolean,
    width: String,
    height: String,
    transform: String
  }
};
</script>
