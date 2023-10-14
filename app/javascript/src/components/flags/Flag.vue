<template>
  <g :transform="transform">
    <component
      :is="flags[nation]"
      :width="width"
      :height="height"
      :transform="transform"
      :x="x"
      :y="y"
      :fleet="fleet"
      :filter="activeFilter"
    />
  </g>
</template>

<script>
import { defineAsyncComponent, markRaw } from 'vue';

export default {
  name: 'Flag',
  props: {
    filter: { type: String, default: '' },
    fleet: Boolean,
    height: { type: String, default: '' },
    nation: { type: String, default: '' },
    transform: { type: String, default: '' },
    width: { type: String, default: '' },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  data: () => ({
    flags: {
      AH: markRaw(defineAsyncComponent(() => import('./AHFlag.vue'))),
      BR: markRaw(defineAsyncComponent(() => import('./BRFlag.vue'))),
      CN: markRaw(defineAsyncComponent(() => import('./CNFlag.vue'))),
      CNAsia: markRaw(defineAsyncComponent(() => import('./CNAsiaFlag.vue'))),
      EU: markRaw(defineAsyncComponent(() => import('./EUFlag.vue'))),
      IN: markRaw(defineAsyncComponent(() => import('./INFlag.vue'))),
      IT: markRaw(defineAsyncComponent(() => import('./ITFlag.vue'))),
      JP: markRaw(defineAsyncComponent(() => import('./JPFlag.vue'))),
      FR: markRaw(defineAsyncComponent(() => import('./FRFlag.vue'))),
      GB: markRaw(defineAsyncComponent(() => import('./GBFlag.vue'))),
      GE: markRaw(defineAsyncComponent(() => import('./GEFlag.vue'))),
      RU: markRaw(defineAsyncComponent(() => import('./RUFlag.vue'))),
      TR: markRaw(defineAsyncComponent(() => import('./TRFlag.vue'))),
      US: markRaw(defineAsyncComponent(() => import('./USFlag.vue'))),
    },
  }),
  computed: {
    activeFilter() {
      if (this.filter === 'grayscale') {
        return 'url(#grayscale)';
      }

      return '';
    },
  },
};
</script>
