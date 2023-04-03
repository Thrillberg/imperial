<template>
  <v-app-bar :elevation="5">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-app-bar-title />
    <div
      v-for="(error, index) in errors"
      :key="index"
    >
      <b>{{ error }}</b>
    </div>
    <v-menu>
      <template #activator="{ props }">
        <!-- User is registered and logged in -->
        <v-btn
          v-if="profile.email"
          prepend-icon="mdi-account"
          class="text-none"
          stacked
          v-bind="props"
        >
          {{ profile.username }}
        </v-btn>
        <!-- User is anonymous (not registered) and logged in -->
        <v-btn
          v-if="profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="mdi-incognito"
          class="text-none"
          stacked
          v-bind="props"
        >
          {{ profile.username }}
        </v-btn>
        <!-- User is not logged in -->
        <v-btn
          v-if="!profile.anonymityConfirmedAt && !profile.email"
          icon="mdi-incognito"
          class="text-none"
          stacked
          v-bind="props"
        />
      </template>
      <v-list>
        <!-- User is registered and logged in -->
        <v-list-item
          v-if="profile.email"
          prepend-icon="mdi-profile"
          title="Profile"
        >
          <router-link :to="{ path: '/users/' + profile.id }" />
        </v-list-item>
        <v-list-item
          v-if="profile.email"
          prepend-icon="mdi-logout"
          title="Log out"
          @click="signOut"
        />
        <!-- User is anonymous (not registered) and logged in -->
        <v-list-item
          v-if="profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="mdi-account-plus"
          title="Register"
          @click="register"
        />
        <v-list-item
          v-if="profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="mdi-logout"
          title="Permanently log out"
          @click="signOut"
        />
        <!-- User is not logged in -->
        <v-list-item
          v-if="!profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="mdi-account-plus"
          title="Register"
          @click="register"
        />
        <v-list-item
          v-if="!profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="mdi-incognito"
          @click="setAnonymous"
        >
          Play anonymously as {{ profile.username }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
  >
    <v-list>
      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        to="/"
      />
      <v-list-item
        prepend-icon="mdi-information"
        title="About"
        to="/about"
      />
      <v-list-item
        prepend-icon="mdi-trophy"
        title="Rankings"
        to="/rankings"
      />
      <v-list-item
        title="Join on Discord!"
        href="https://discord.gg/VnxKwuQmg8"
      >
        <template #prepend>
          <discord-icon
            class="v-icon v-icon--size-default"
            fill="#5865F2"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { DiscordIcon } from 'vue3-simple-icons';

export default {
  name: 'Header',
  components: { DiscordIcon },
  props: {
    profile: { type: Object, default: () => {} },
  },
  emits: ['anonymity_confirmed', 'signOut'],
  data: () => ({
    drawer: false,
    email: '',
    errors: [],
    group: null,
    password: '',
    tempName: '',
  }),
  watch: {
    group() {
      this.navDrawer = false;
    },
  },
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
      this.$cookies.set('user_id');
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
          this.$emit('anonymity_confirmed', data.anonymity_confirmed_at);
        });
    },
  },
};
</script>
