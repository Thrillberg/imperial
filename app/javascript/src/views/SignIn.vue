<template>
  <v-container>
    <v-sheet
      width="300"
      class="mx-auto"
    >
      <div
        v-for="(error, index) in errors"
        :key="index"
      >
        {{ error }}
      </div>
      <v-form @submit="signIn">
        <v-container>
          <v-row>
            <v-text-field
              v-model="email"
              label="Email"
              required
            />
          </v-row>
          <v-row>
            <v-text-field
              v-model="password"
              label="Password"
              required
            />
          </v-row>
          <v-row>
            <v-btn
              type="submit"
              block
            >
              Sign In
            </v-btn>
          </v-row>
          <v-row>
            <v-btn
              to="/forgot_password"
              class="mt-2"
              block
            >
              Forgot your password?
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  name: 'SignIn',
  props: { profile: { type: Object, default: () => {} } },
  emits: ['signedIn'],
  data() {
    return {
      email: '',
      errors: [],
      password: '',
    };
  },
  created() {
    document.title = 'Sign In - Imperial';
  },
  methods: {
    signIn(e) {
      fetch('/accounts/sign_in', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': this.$cookies.get('CSRF-TOKEN'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
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
