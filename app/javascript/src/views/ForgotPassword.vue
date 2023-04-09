<template>
  <v-container>
    <v-sheet
      width="300"
      class="mx-auto"
    >
      <div v-if="passwordResetEmailSent">
        Check your email (and your spam folder).
      </div>
      <v-form
        v-else
        @submit="submitForgotPassword"
      >
        <v-container>
          <v-row>
            <v-text-field
              v-model="email"
              label="Email"
              required
            />
          </v-row>
          <v-row>
            <v-btn
              type="submit"
              block
            >
              {{ passwordResetEmailRequested ? 'Sending you an email...' : 'Get password reset link' }}
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      errors: [],
      passwordResetEmailRequested: false,
      passwordResetEmailSent: false,
    };
  },
  created() {
    document.title = 'Forgot Password - Imperial';
  },
  methods: {
    submitForgotPassword(e) {
      this.passwordResetEmailRequested = true;
      fetch(`${import.meta.env.VITE_API_URL}/accounts/password`, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': this.$cookies.get('CSRF-TOKEN'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account: { email: this.email } }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.errors) {
            this.errors = data.errors;
          } else {
            this.errors = [];
            this.passwordResetEmailSent = true;
          }
        });
      e.preventDefault();
    },
  },
};
</script>
