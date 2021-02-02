<template>
  <div>
    <div v-for="(error, index) in errors" v-bind:key="index">
      {{ error }}
    </div>
    <form class="flex flex-col w-1/4 mx-auto border-2 rounded border-green-800 p-5 mt-5" @submit="register">
      <input
        type="text"
        :placeholder="profile.username"
        v-model="username"
        class="rounded p-5 border border-green-800 my-2"
      />
      <input
        type="text"
        placeholder="email"
        v-model="email"
        class="rounded p-5 border border-green-800 my-2"
      />
      <input
        type="password"
        placeholder="password"
        v-model="password"
        class="rounded p-5 border border-green-800 my-2"
      />
      <input
        type="submit"
        value="Register"
        class="rounded p-5 bg-green-800 text-white cursor-pointer my-2 text-lg"
      />
    </form>
  </div>
</template>

<script>
export default {
  name: "Register",
  props: ["profile"],
  data: function () {
    return {
      email: "",
      errors: [],
      password: "",
      username: ""
    }
  },
  methods: {
    register: function(e) {
      fetch("/accounts", {
        method: "POST",
        headers: {
          "X-CSRF-Token": this.$cookies.get("CSRF-TOKEN"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: this.username, email: this.email, password: this.password })
      })
        .then(response => response.json())
        .then(data => {
          if (data.email) {
            this.$emit("registered", data);
            this.errors = [];
            this.$router.push("/");
          } else {
            this.errors = data;
          }
        })
      e.preventDefault();
    }
  }
}
</script>
