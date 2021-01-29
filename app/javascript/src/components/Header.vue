<template>
  <div>
    <div class="bg-green-500 flex justify-between">
      <div class="float-left p-2 bg-green-100">
        <strong>This project is under active development!<br>User and game data may be lost at any given time.</strong>
      </div>
      <div v-if="!profile.username || (profile.registered && !profile.email)">
        <span>
          Currently identified as <strong>{{ profile.username }}</strong>.
        </span>
        <span class="inline-block">
          <div v-for="(error, index) in errors" v-bind:key="index">
            {{ error }}
          </div>
          <form class="p-4 bg-green-500 rounded" @submit="signIn">
            <input
              type="text"
              placeholder="email"
              v-model="email"
              class="rounded p-2"
            />
            <input
              type="password"
              placeholder="password"
              v-model="password"
              class="rounded p-2"
            />
            <input
              type="submit"
              value="Sign In"
              class="rounded p-2 bg-green-800 text-white cursor-pointer"
            />
          </form>
        </span>
      </div>
      <div v-else class="py-3 px-2">
        <p>Currently logged in as <strong>{{ profile.username }}</strong> ({{ profile.email }}).</p>
        <p
        class="bg-green-200 cursor-pointer border border-green-200 rounded px-1 inline-block"
        @click="signOut"
        >Sign out</p>
      </div>
    </div>
    <div v-if="!profile.username" class="text-center p-2 bg-green-100">
      <p class="text-lg">Please submit a username to start playing!</p>
      <p class="text-sm">Or log in above if you already have an account.</p>
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
  </div>
</template>

<script>
import { apiClient } from "../router/index.js";

export default {
  name: "Header",
  props: ["profile"],
  data: () => {
    return {
      email: "",
      errors: [],
      password: "",
      tempName: ""
    };
  },
  methods: {
    signIn: function(e) {
      fetch("/accounts/sign_in", {
        method: "POST",
        headers: {
          "X-CSRF-Token": this.$cookies.get("CSRF-TOKEN"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ session: { email: this.email, password: this.password }})
      })
        .then(response => response.json())
        .then(data => {
          if (data.email) {
            this.$emit("signedIn", data);
            this.errors = [];
          } else {
            this.errors = data;
          }
        })
      e.preventDefault();
    },
    signOut: function (e) {
      fetch("/accounts/sign_out", {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": this.$cookies.get("CSRF-TOKEN")
        }
      })
      this.$emit("signOut");
      e.preventDefault();
    }
  }
};
</script>
