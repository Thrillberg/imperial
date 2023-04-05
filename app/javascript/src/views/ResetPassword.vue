<template>
  <v-container>
    <form
      class="flex flex-col mx-auto rounded bg-green-200 max-w-4xl mt-10 p-20"
      @submit="submitResetPassword"
    >
      <input
        v-model="password"
        type="password"
        placeholder="password"
        class="rounded p-5 border border-green-800 my-2 w-1/2 self-center"
      >
      <input
        type="submit"
        value="Create new password"
        class="rounded p-5 bg-green-800 text-white cursor-pointer my-2 text-2xl w-1/2 self-center"
      >
    </form>
  </v-container>
</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    return { password: '' };
  },
  created() {
    document.title = 'Reset Password - Imperial';
  },
  methods: {
    submitResetPassword(e) {
      fetch('accounts/password', {
        method: 'PUT',
        headers: {
          'X-CSRF-Token': this.$cookies.get('CSRF-TOKEN'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: {
            password: this.password,
            reset_password_token: this.$route.query.reset_password_token,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.email) {
            this.$emit('signedIn', { username: data.username, email: data.email });
            this.errors = [];
            this.$router.push('/');
          } else {
            this.errors = data;
          }
        });
      e.preventDefault();
    },
  },
};
</script>
