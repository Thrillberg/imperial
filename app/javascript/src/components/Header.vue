<template>
  <div class="h-20 bg-green-500">
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
        <p>Currently logged in as <strong>{{ profile.username }}</strong> ({{ profile.email }}).</p>
        <form method="DELETE" action="/accounts/sign_out">
          <input type="submit" value="Log out" class="bg-green-200 cursor-pointer border border-green-200 rounded p-1" />
        </form>
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
