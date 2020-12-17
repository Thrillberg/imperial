<template>
  <div class="h-16 bg-green-500">
    <div class="float-right p-2">
      <div v-if="alreadyRegistered()">
        Currently registered as <strong>{{ username }}</strong
        >.
      </div>
      <div v-else>
        <input
          class="mx-auto border-black border-solid border p-3 rounded"
          v-model="tempName"
          placeholder="name"
        />
        <span
          v-on:click="registerUser(tempName)"
          class="rounded p-4 ml-4 bg-green-800 text-white cursor-pointer"
        >
          Register
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { apiClient } from "../router/index.js";

export default {
  name: "Header",
  props: ["username", "users"],
  data: () => {
    return {
      tempName: ""
    };
  },
  methods: {
    alreadyRegistered: function() {
      return [...this.users]
        .map(x => x.id)
        .includes(this.$cookies.get("userId"));
    },
    registerUser: function(name) {
      apiClient.registerUser(name);
    }
  }
};
</script>
