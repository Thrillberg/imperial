<template>
  <header>
    <div class="bg-green-200 flex justify-between px-8">
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
      </div>
      <div class="flex justify-evenly">
        <span v-if="profile.anonymity_confirmed_at" class="self-center mr-10">Playing as {{ profile.username }}</span>
        <span v-if="profile.email" class="self-center mr-10">Signed in as {{ profile.username }}</span>
        <button
          v-if="!profile.email"
          class="rounded py-2 px-6 my-4 bg-green-800 text-white cursor-pointer"
          @click="signIn"
        >
          Not Signed In
        </button>
        <button
          v-if="profile.email"
          class="rounded py-2 px-6 my-4 bg-green-800 text-white cursor-pointer"
          @click="signOut"
          >
          Sign Out
        </button>
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
    },
    signIn() {
      if (this.$route.path !== "/sign_in") {
        this.$router.push("/sign_in");
      }
    }
  }
};
</script>
