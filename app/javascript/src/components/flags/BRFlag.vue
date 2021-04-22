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
    <path
       id="D"
       d="M -31.5,0 h 33 a 30 30 0 0 0 30,-30 v -10 a 30 30 0 0 0 -30,-30 H -31.5 z M -18.5,-13 h 19 a 19 19 0 0 0 19,-19 v -6 a 19 19 0 0 0 -19,-19 H -18.5 z"
       fill-rule="evenodd" />
    <path
       id="E"
       d="M 0,0 h 63 v -13 H 12 v -18 h 40 v -12 h -40 v -14 H 60 v -13 H 0 z"
       transform="translate(-31.5)" />
    <path
       id="e"
       d="M -26.25,0 h 52.5 v -12 h -40.5 v -16 h 33 v -12 h -33 v -11 H 25 v -12 H -26.25 z" />
    <g
       id="G">
      <clipPath
         id="gcut">
        <path
           d="M -31.5,0 v -70 h 63 v 70 z M 0,-47 v 12 h 31.5 v -12 z"
           id="path13" />
      </clipPath>
      <use
         xlink:href="#O"
         clip-path="url(#gcut)"
         id="use16" />
      <rect
         x="5"
         y="-35"
         width="26.5"
         height="10"
         id="rect18" />
      <rect
         x="21.5"
         y="-35"
         width="10"
         height="35"
         id="rect20" />
    </g>
    <path
       id="M"
       d="M -31.5,0 h 12 v -48 l 14,48 h 11 l 14,-48 V 0 h 12 V -70 h -17.5 l -14,48 l -14,-48 H -31.5 z" />
    <path
       id="O"
       d="M 0,0 a 31.5 35 0 0 0 0,-70 a 31.5 35 0 0 0 0,70 M 0,-13 a 18.5 22 0 0 0 0,-44 a 18.5 22 0 0 0 0,44"
       fill-rule="evenodd" />
    <path
       id="P"
       d="M -31.5,0 h 13 v -26 h 28 a 22 22 0 0 0 0,-44 h -40 z M -18.5,-39 h 27 a 9 9 0 0 0 0,-18 h -27 z"
       fill-rule="evenodd" />
    <g
       id="R">
      <use
         xlink:href="#P"
         id="use26" />
      <path
         d="M 28,0 c 0,-10 0,-32 -15,-32 h -19 c 22,0 22,22 22,32"
         id="path28" />
    </g>
    <path
       id="S"
       d="M -15.75,-22 C -15.75,-15 -9,-11.5 1,-11.5 C 11,-11.5 15.74,-14.75 15.75,-19.25 C 15.75,-33.5 -31,-24.5 -30.75,-49.5 C -30.5,-71 -6,-70 3,-70 C 12,-70 29,-66 28.75,-48.75 L 13.5,-48.75 C 13.5,-56.25 6.5,-59 -1.5,-59 C -9.25,-59 -14.75,-57.75 -14.75,-50.5 C -15,-38.75 31.5,-46.5 31.5,-21.75 C 31.5,-3.5 13.5,0 0,0 C -11.5,0 -31.55,-4.5 -31.5,-22 z" />
    <g
       id="star"
       fill="#fff">
      <g
         id="c">
        <path
           id="t"
           d="M 0,-1 v 1 h .5"
           transform="rotate(18 0,-1)" />
        <use
           xlink:href="#t"
           transform="scale(-1,1)"
           id="use33" />
      </g>
      <use
         xlink:href="#c"
         transform="rotate(72)"
         id="use36" />
      <use
         xlink:href="#c"
         transform="rotate(-72)"
         id="use38" />
      <use
         xlink:href="#c"
         transform="rotate(144)"
         id="use40" />
      <use
         xlink:href="#c"
         transform="rotate(-144)"
         id="use42" />
    </g>
    <use
       id="star1"
       xlink:href="#star"
       transform="scale(31.5)" />
    <use
       id="star2"
       xlink:href="#star"
       transform="scale(26.25)" />
    <use
       id="star3"
       xlink:href="#star"
       transform="scale(21)" />
    <use
       id="star4"
       xlink:href="#star"
       transform="scale(15)" />
    <use
       id="star5"
       xlink:href="#star"
       transform="scale(10.5)" />
  </defs>
  <rect
     fill="#009b3a"
     id="rect52"
     style="stroke-width:0.39032"
     width="100%"
     height="100%" />
  <path
     d="M 89.34433,523.77066 769.67239,958.197 1450.0005,523.77066 769.67239,89.34431 Z"
     fill="#fedf00"
     id="path54"
     style="stroke-width:0.39032" />
  <circle
     r="286.88531"
     fill="#002776"
     id="circle56"
     cx="769.67236"
     cy="523.77063"
     style="stroke-width:0.39032" />
  <clipPath
     id="band">
    <circle
       r="735"
       id="circle58" />
  </clipPath>
  <path
     d="m -2205,1470 a 1785,1785 0 0 1 3570,0 h -105 a 1680,1680 0 1 0 -3360,0 z"
     clip-path="url(#band)"
     fill="#ffffff"
     id="path61"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)" />
  <g
     fill="#009b3a"
     transform="matrix(0.39032016,0,0,0.39032016,605.73792,1097.5413)"
     id="g93">
    <use
       xlink:href="#O"
       y="-1697.5"
       transform="rotate(-7)"
       id="use63"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#R"
       y="-1697.5"
       transform="rotate(-4)"
       id="use65"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#D"
       y="-1697.5"
       transform="rotate(-1)"
       id="use67"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#E"
       y="-1697.5"
       transform="rotate(2)"
       id="use69"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#M"
       y="-1697.5"
       transform="rotate(5)"
       id="use71"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#e"
       y="-1697.5"
       transform="rotate(9.75)"
       id="use73"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#P"
       y="-1697.5"
       transform="rotate(14.5)"
       id="use75"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#R"
       y="-1697.5"
       transform="rotate(17.5)"
       id="use77"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#O"
       y="-1697.5"
       transform="rotate(20.5)"
       id="use79"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#G"
       y="-1697.5"
       transform="rotate(23.5)"
       id="use81"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#R"
       y="-1697.5"
       transform="rotate(26.5)"
       id="use83"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#E"
       y="-1697.5"
       transform="rotate(29.5)"
       id="use85"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#S"
       y="-1697.5"
       transform="rotate(32.5)"
       id="use87"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#S"
       y="-1697.5"
       transform="rotate(35.5)"
       id="use89"
       x="0"
       width="100%"
       height="100%" />
    <use
       xlink:href="#O"
       y="-1697.5"
       transform="rotate(38.5)"
       id="use91"
       x="0"
       width="100%"
       height="100%" />
  </g>
  <use
     id="αCMi"
     xlink:href="#star1"
     x="-600"
     y="-132"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="αCMa"
     xlink:href="#star1"
     x="-535"
     y="177"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="βCMa"
     xlink:href="#star2"
     x="-625"
     y="243"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="γCMa"
     xlink:href="#star4"
     x="-463"
     y="132"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="δCMa"
     xlink:href="#star2"
     x="-382"
     y="250"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="εCMa"
     xlink:href="#star3"
     x="-404"
     y="323"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="αVir"
     xlink:href="#star1"
     x="228"
     y="-228"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="αSco"
     xlink:href="#star1"
     x="515"
     y="258"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="βSco"
     xlink:href="#star3"
     x="617"
     y="265"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="εSco"
     xlink:href="#star2"
     x="545"
     y="323"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="θSco"
     xlink:href="#star2"
     x="368"
     y="477"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="ιSco"
     xlink:href="#star3"
     x="367"
     y="551"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="κSco"
     xlink:href="#star3"
     x="441"
     y="419"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="λSco"
     xlink:href="#star2"
     x="500"
     y="382"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="μSco"
     xlink:href="#star3"
     x="365"
     y="405"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="αHya"
     xlink:href="#star2"
     x="-280"
     y="30"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="γHya"
     xlink:href="#star3"
     x="200"
     y="-37"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="αCru"
     xlink:href="#star1"
     y="330"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     x="0"
     width="100%"
     height="100%" />
  <use
     id="βCru"
     xlink:href="#star2"
     x="85"
     y="184"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="γCru"
     xlink:href="#star2"
     y="118"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     x="0"
     width="100%"
     height="100%" />
  <use
     id="δCru"
     xlink:href="#star3"
     x="-74"
     y="184"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="εCru"
     xlink:href="#star4"
     x="-37"
     y="235"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="αTrA"
     xlink:href="#star2"
     x="220"
     y="495"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="βTrA"
     xlink:href="#star3"
     x="283"
     y="430"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="γTrA"
     xlink:href="#star3"
     x="162"
     y="412"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="αCar"
     xlink:href="#star1"
     x="-295"
     y="390"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     width="100%"
     height="100%" />
  <use
     id="σOct"
     xlink:href="#star5"
     y="575"
     transform="matrix(0.39032016,0,0,0.39032016,769.67239,523.77066)"
     x="0"
     width="100%"
     height="100%" />
    </g>
  </svg>
</template>
