<template>
  <v-container>
    <v-card>
      <v-card-text>
        <b>PlayImperial</b> is a web implementation of the board game, <b><a
          href="https://en.wikipedia.org/wiki/Imperial_(board_game)"
          class="underline"
        >Imperial</a></b> by Mac Gerdts. The board game can be purchased from the publisher <a
          href="https://www.pd-verlag.de/epages/es719366.sf/en_GB/?ObjectPath=/Shops/es719366/Products/9703"
          class="underline"
        >here</a>.
      </v-card-text>
      <v-card-text>
        PlayImperial in an open-source project, the code for which can be found <a
          href="https://www.github.com/thrillberg/imperial"
          class="underline"
        >on GitHub</a>. We always welcome new contributors!
      </v-card-text>
      <v-card-text>
        Feel free to say hi <a
          href="https://discord.gg/Q2Ynzp2Axs"
          class="underline"
        >on Discord</a>!
      </v-card-text>
      <v-card-text>
        The <a
          href="https://boardgamegeek.com/filepage/29449/imperial-asia-expansion-map-and-rules"
          class="underline"
        ><b>Imperial Asia</b></a> expansion was designed by Greg Berry.
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  created() {
    document.title = 'About - Imperial';
  },
};
</script>
