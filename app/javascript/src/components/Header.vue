<template>
  <header>
    <div class="bg-green-500 flex justify-between">
      <div class="bg-white m-2 border-2 rounded border-red-500 p-4">
        This project is under active development and data may be lost at any time!
      </div>
      <div class="flex">
        <router-link
          :to="{ path: '/' }"
          class="self-center pr-8 underline"
        >
          Home
        </router-link>
        <router-link
          :to="{ path: '/rules' }"
          class="self-center pr-8 underline"
        >
          How to play
        </router-link>
        <router-link
          :to="{ path: '/about' }"
          class="self-center pr-8 underline"
        >
          About
        </router-link>
        <div v-for="(error, index) in errors" v-bind:key="index" class="text-red-700">
          <b>{{ error }}</b>
        </div>
        <div class="flex flex-col justify-evenly">
          <div v-if="profile.email" class="py-3 px-2">
            <p>Currently signed in as <strong>{{ profile.username }}</strong> ({{ profile.email }}).</p>
            <p
            class="bg-green-200 cursor-pointer border border-green-200 rounded px-1 inline-block"
            @click="signOut"
            >Sign out</p>
          </div>
          <span v-if="!profile.email" class="inline-block">
            <form class="pr-4 bg-green-500 rounded flex" @submit="signIn">
              <div class="flex flex-col mr-2">
                <label class="text-sm">email</label>
                <input
                  type="text"
                  placeholder="email"
                  v-model="email"
                  class="rounded p-2"
                />
              </div>
              <div class="flex flex-col mr-2">
                <label class="text-sm">password</label>
                <input
                  type="password"
                  placeholder="password"
                  v-model="password"
                  class="rounded p-2"
                />
              </div>
              <div class="flex flex-col justify-end">
                <input
                  type="submit"
                  value="Sign In"
                  class="rounded p-2 bg-green-800 text-white cursor-pointer"
                />
              </div>
            </form>
          </span>
          <div v-if="!profile.email">
            Currently identified as <strong>{{ profile.username }}</strong>.
          </div>
        </div>
      </div>
    </div>
  </header>
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
