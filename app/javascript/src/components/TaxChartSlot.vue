<template>
  <div class="flex flex-col justify-evenly items-center">
    <div class="underline">{{ taxSlot }}</div>
    <div class="flex flex-wrap">
      <svg
        width="14px"
        height="14px"
        viewBox="0 0 14 14"
        version="1.1"
        v-for="nation in nations"
        :key="nation"
        class="m-0.5"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <circle
            :cx="7"
            :cy="7"
            r="7"
            stroke-width="0.5"
            stroke="black"
            :fill="fill(nation)"
          ></circle>
        </g>
      </svg>
    </div>
    <div>+ {{ taxSlot - 5 }}</div>
  </div>
</template>

<script>
export default {
  name: "TaxChartSlot",
  props: {
    taxSlot: Number,
    nations: Array
  },
  methods: {
    fill(nation) {
      switch (nation) {
        case "AH":
          return "#EBE084"
        case "IT":
          return "#6E8D4E"
        case "FR":
          return "#54BFF9"
        case "GB":
          return "#EF7F72"
        case "GE":
          return "#8F8F8F"
        case "RU":
          return "#9C6BAE"
        case "CN":
          return "#ebe084"
        case "IN":
          return "silver"
        case "BR":
          return "#6E8D4E"
        case "US":
          return "#EF7F72"
        case "EU":
          return "#54bff9"
      }
    }
  }
};
</script>
