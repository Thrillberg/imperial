<template>
  <div class="h-16 bg-green-500">
    <div class="float-left p-2 bg-green-100">
      <strong>This project is under active development!<br>User and game data may be lost at any given time.</strong>
    </div>
    <div class="float-right p-2">
      <div v-if="!profile.username">
        <form method="post" action="/users">
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
            value="Submit Username"
            class="rounded p-4 ml-4 bg-green-800 text-white cursor-pointer"
          />
        </form>
      </div>
      <div v-else-if="!profile.email">
        Currently identified as <strong>{{ profile.username }}</strong>.
      </div>
      <div v-else>
        Currently registered as <strong>{{ profile.username }}</strong> ({{ profile.email }}).
      </div>
    </div>
  </div>
</template>

<script>
import { apiClient } from "../router/index.js";

export default {
  name: "Header",
  props: ["profile"],
  data: () => {
    return {
      tempName: ""
    };
  },
};
</script>
