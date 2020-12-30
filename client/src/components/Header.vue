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
      if (this.users.size > 0) {
        const user = [...this.users].find(
          user => user.id === this.$cookies.get("user_id")
        );
        return user.name !== "anonymous";
      } else {
        return false;
      }
    },
    registerUser: function() {
      fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.tempName,
          id: this.$cookies.get("user_id")
        })
      });
    }
  }
};
</script>
