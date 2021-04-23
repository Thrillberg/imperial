<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    :width="width"
    :height="height"
    fill="#EE1C25"
  >
    <filter id="grayscale">
      <feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"/>
    </filter>
    <g
    v-bind:clip-path="this.fleet ? 'url(#fleetClip)' : ''" :filter="activeFilter"
    >
      <defs>
      <path id="s" d="M0,-1 0.587785,0.809017 -0.951057,-0.309017H0.951057L-0.587785,0.809017z" fill="#FFFF00"/>
      </defs>
    <rect
       fill="#ee1c25"
       style="stroke-width:50"
       id="rect257"
       x="0"
       y="-0.00099218753"
       width="1500"
       height="1000" />
    <use
       xlink:href="#s"
       transform="matrix(150.00001,0,0,150.00001,249.99999,249.99901)"
       id="use259"
       x="0"
       y="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#s"
       transform="matrix(46.012877,19.565666,-19.565666,46.012877,499.99999,99.99901)"
       id="use261"
       x="0"
       y="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#s"
       transform="matrix(34.8145,35.888031,-35.888031,34.8145,599.99999,199.99902)"
       id="use263"
       x="0"
       y="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#s"
       transform="matrix(17.145778,46.968314,-46.968314,17.145778,599.99999,349.99902)"
       id="use265"
       x="0"
       y="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#s"
       transform="matrix(46.784589,17.640929,-17.640929,46.784589,499.99999,449.99903)"
       id="use267"
       x="0"
       y="0"
       width="100%"
       height="100%" />
    </g>
  </svg>
</template>

<script>
export default {
  name: "CNFlag",
  props: {
    activeFilter: String,
    fleet: Boolean,
    width: String,
    height: String,
    transform: String
  }
};
</script>
