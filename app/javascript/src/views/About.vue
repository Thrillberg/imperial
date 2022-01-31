<template>
  <div class="container mx-auto sm:w-1/2">
    <b class="text-xl">About PlayImperial</b>
    <div class="mt-5">
      <p>
      <b>PlayImperial</b> is a web implementation of the board game, <b><a href="https://en.wikipedia.org/wiki/Imperial_(board_game)" class="underline">Imperial</a></b> by Mac Gerdts. The board game can be purchased from the publisher <a href="https://www.pd-verlag.de/epages/es719366.sf/en_GB/?ObjectPath=/Shops/es719366/Products/9703" class="underline">here</a>.</p>
      <p>PlayImperial in an open-source project, the code for which can be found <a href="https://www.github.com/thrillberg/imperial" class="underline">on GitHub</a>. We always welcome new contributors!</p>
      <p>Feel free to say hi <a href="https://discord.gg/VnxKwuQmg8" class="underline">on Discord</a>!</p>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    document.title = "About - Imperial";
  }
}
</script>
