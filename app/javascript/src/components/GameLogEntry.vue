<template>
  <div class="border border-black rounded p-2 m-2">
    <div>
      <b>Type:</b> {{ action.type }}
    </div>
    <div>
      <b>Payload:</b> {{ action.payload }}
    </div>
  </div>
</template>

<script>
export default {
  name: "GameLogEntry",
  props: { action: Object }
}
</script>
