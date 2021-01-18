<template>
  <div class="h-16 bg-green-500">
    <div class="float-right p-2">
      <div v-if="alreadyRegistered()">
        Currently registered as <strong>{{ username }}</strong
        >.
      </div>
      <div v-else>
        <form method="post" action="/user">
          <input
            class="mx-auto border-black border-solid border p-3 rounded"
            v-model="tempName"
            name="name"
            placeholder="name"
          />
          <input
            type="hidden"
            name="id"
            :value="this.$cookies.get('user_id')"
          />
          <input
            type="submit"
            value="Submit"
            class="rounded p-4 ml-4 bg-green-800 text-white cursor-pointer"
          />
        </form>
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
      if (this.users.length > 0) {
        const user = this.users.find(
          user => user.id === this.$cookies.get("user_id")
        );
        return user.name !== "anonymous";
      } else {
        return false;
      }
    },
  }
};
</script>
