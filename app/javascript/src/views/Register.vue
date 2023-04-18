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
      <v-form @submit="register">
        <v-container>
          <v-row>
            <v-text-field
              v-model="username"
              label="Username"
              required
            />
          </v-row>
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
              type="password"
              required
            />
          </v-row>
          <v-row>
            <v-btn
              type="submit"
              block
            >
              Register
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  name: 'Register',
  props: { profile: { type: Object, default: () => {} } },
  emits: ['registered'],
  data() {
    return {
      email: '',
      errors: [],
      password: '',
      username: '',
    };
  },
  created() {
    document.title = 'Register - Imperial';
  },
  methods: {
    register(e) {
      fetch('/accounts', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': this.$cookies.get('CSRF-TOKEN'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: this.username, email: this.email, password: this.password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.email) {
            this.$emit('registered', { ...data, oldUsername: this.profile.username });
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
