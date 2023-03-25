<template>
  <header>
    <div>
      <div class="bg-green-200 flex justify-center sm:justify-between flex-wrap sm:flex-nowrap text-sm sm:px-8 sm:text-base">
        <div class="flex">
          <router-link
            :to="{ path: '/' }"
            class="self-center underline px-1 sm:pr-8"
          >
            Home
          </router-link>
          <router-link
            :to="{ path: '/about' }"
            class="self-center underline px-1 sm:pr-8"
          >
            About
          </router-link>
          <router-link
            :to="{ path: '/rankings' }"
            class="self-center underline px-1 sm:pr-8"
          >
            Rankings
          </router-link>
          <div
            v-for="(error, index) in errors"
            :key="index"
            class="text-red-700 px-1 sm:pr-8"
          >
            <b>{{ error }}</b>
          </div>
        </div>
        <div class="flex">
          <span
            v-if="profile.anonymityConfirmedAt && !profile.registered"
            class="self-center px-1 sm:px-8"
          >Playing as {{ profile.username }}</span>
          <span
            v-if="profile.email"
            class="self-center px-1 sm:px-8"
          >Signed in as
            <router-link
              :to="{ path: '/users/' + profile.id }"
              class="underline"
            >
              {{ profile.username }}
            </router-link>
          </span>
          <button
            v-if="!profile.email"
            class="rounded py-2 px-1 sm:px-6 my-1 sm:my-4 bg-green-800 text-white cursor-pointer"
            @click="signIn"
          >
            Sign In
          </button>
          <button
            v-if="!profile.email"
            class="rounded py-2 px-1 sm:px-6 my-1 sm:my-4 bg-green-800 text-white cursor-pointer ml-5"
            @click="register"
          >
            Register
          </button>
          <button
            v-if="profile.email"
            class="rounded py-2 px-1 sm:px-6 my-1 sm:my-4 bg-green-800 text-white cursor-pointer"
            @click="signOut"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div
        v-if="!profile.anonymityConfirmedAt && !profile.registered"
        class="bg-yellow-100 py-2 px-1 sm:px-6"
      >
        You are not yet registered. You may
        <span
          v-if="profile.username"
          class="underline cursor-pointer"
          @click="setAnonymous"
        >
          play anonymously as {{ profile.username }}
        </span>
        or
        <span
          class="underline cursor-pointer"
          @click="register"
        >
          register an account
        </span>
        .
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: ['profile'],
  data: () => ({
    email: '',
    errors: [],
    password: '',
    tempName: '',
  }),
  methods: {
    signIn() {
      if (this.$route.path !== '/sign_in') {
        this.$router.push('/sign_in');
      }
    },
    signOut(e) {
      fetch('/accounts/sign_out', {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': this.$cookies.get('CSRF-TOKEN'),
        },
      });
      this.$emit('signOut');
      e.preventDefault();
    },
    register() {
      if (this.$route.path !== '/register') {
        this.$router.push('/register');
      }
    },
    setAnonymous() {
      fetch(
        '/anonymity_confirmations',
        {
          method: 'POST',
          body: JSON.stringify({ id: this.$cookies.get('user_id') }),
          headers: { 'Content-Type': 'application/json' },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          this.$emit('anonymity_confirmed', data.anonymityConfirmedAt);
        });
    },
  },
};
</script>
