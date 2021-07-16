<template>
  <div>
    <div v-for="(error, index) in errors" v-bind:key="index">
      {{ error }}
    </div>
    <div v-if="passwordResetEmailSent" class="flex flex-col mx-auto rounded bg-green-200 sm:max-w-4xl mt-10 sm:p-20 text-2xl">
      Check your email (and your spam folder).
    </div>
    <form v-else class="flex flex-col mx-auto rounded bg-green-200 sm:max-w-4xl mt-10 sm:p-20" @submit="submitForgotPassword">
      <input
        type="text"
        placeholder="email"
        v-model="email"
        class="rounded p-5 border border-green-800 my-2 sm:w-1/2 self-center"
      />
      <input
        type="submit"
        :value="passwordResetEmailRequested ? 'Sending you an email...' : 'Get password reset link'"
        class="rounded p-5 bg-green-800 text-white cursor-pointer my-2 text-2xl sm:w-1/2 self-center"
      />
    </form>
  </div>
</template>

<script>
export default {
  name: "ForgotPassword",
  data: function () {
    return {
      email: "",
      errors: [],
      passwordResetEmailRequested: false,
      passwordResetEmailSent: false
    }
  },
  methods: {
    submitForgotPassword: function(e) {
      this.passwordResetEmailRequested = true;
      fetch("accounts/password", {
        method: "POST",
        headers: {
          "X-CSRF-Token": this.$cookies.get("CSRF-TOKEN"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ account: { email: this.email }})
      })
        .then(response => response.json())
        .then(data => {
          if (data.errors) {
            this.errors = data.errors;
          } else {
            this.errors = [];
            this.passwordResetEmailSent = true;
          }
        })
      e.preventDefault();
    }
  }
}
</script>
