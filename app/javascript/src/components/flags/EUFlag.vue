<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1500 1000"
    :width="width"
    :height="height"
  >
    <g
      :clip-path="fleet ? 'url(#fleetClip)' : ''"
      :filter="activeFilter"
    >
      <g
        :id="randomId2"
      >
        <g
          :id="randomId3"
        >
          <path
            :id="randomId1"
            d="M0,0v1h0.5z"
            transform="translate(0,-1)rotate(18)"
          />
          <use
            :href="'#' + randomId1"
            transform="scale(-1,1)"
          />
        </g>
        <g
          :id="randomId4"
        >
          <use
            :href="'#' + randomId3"
            transform="rotate(72)"
          />
          <use
            :href="'#' + randomId3"
            transform="rotate(144)"
          />
        </g>
        <use
          :href="'#' + randomId4"
          transform="scale(-1,1)"
        />
      </g>
      <rect
        fill="#003399"
        width="1500"
        height="1000"
        x="0"
        y="0"
        style="stroke-width:1.85185"
      />
      <g
        fill="#ffcc00"
        stroke-width="0"
        transform="matrix(55.555556,0,0,55.555556,750,500)"
      >
        <use
          :href="'#' + randomId2"
          y="-6"
          x="0"
          width="100%"
          height="100%"
        />
        <use
          :href="'#' + randomId2"
          y="6"
          x="0"
          width="100%"
          height="100%"
        />
        <g
          :id="randomId5"
        >
          <use
            :href="'#' + randomId2"
            x="-6"
            y="0"
            width="100%"
            height="100%"
          />
          <use
            :href="'#' + randomId2"
            transform="rotate(-144,-2.3441661,-2.1106967)"
            x="0"
            y="0"
            width="100%"
            height="100%"
          />
          <use
            :href="'#' + randomId2"
            transform="rotate(144,-2.1106967,-2.3441661)"
            x="0"
            y="0"
            width="100%"
            height="100%"
          />
          <use
            :href="'#' + randomId2"
            transform="rotate(72,-4.6626491,-2.0759451)"
            x="0"
            y="0"
            width="100%"
            height="100%"
          />
          <use
            :href="'#' + randomId2"
            transform="rotate(72,-5.0759451,0.53350333)"
            x="0"
            y="0"
            width="100%"
            height="100%"
          />
        </g>
        <use
          :href="'#' + randomId5"
          transform="scale(-1,1)"
          x="0"
          y="0"
          width="100%"
          height="100%"
        />
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'EUFlag',
  props: {
    activeFilter: String,
    fleet: Boolean,
    width: String,
    height: String,
    transform: String,
  },
  data: () => ({
    randomId1: '',
    randomId2: '',
    randomId3: '',
    randomId4: '',
    randomId5: '',
  }),
  created() {
    this.randomId1 = Math.floor(Math.random() * 1000000).toString();
    this.randomId2 = Math.floor(Math.random() * 1000000).toString();
    this.randomId3 = Math.floor(Math.random() * 1000000).toString();
    this.randomId4 = Math.floor(Math.random() * 1000000).toString();
    this.randomId5 = Math.floor(Math.random() * 1000000).toString();
  },
};
</script>
