<template>
  <v-app-bar
    :elevation="5"
    :class="(profile.registered || profile.anonymityConfirmedAt) ? 'bg-primary' : 'bg-grey-lighten-2'"
  >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-btn
      v-if="$route.path !== '/'"
      to="/"
      prepend-icon="$home"
      stacked
    >
      Home
    </v-btn>
    <v-btn
      v-if="(profile.registered || profile.anonymityConfirmedAt) && $route.path !== '/games/new'"
      href="/games/new"
      class="bg-primary-darken-1"
    >
      New Game
    </v-btn>
    <v-app-bar-title />
    <div
      v-for="(error, index) in errors"
      :key="index"
    >
      <b>{{ error }}</b>
    </div>
    <v-menu>
      <template #activator="{ props }">
        <!-- User is registered and signed in -->
        <v-btn
          v-if="profile.email"
          :prepend-icon="mdiAccount"
          class="text-none"
          stacked
          v-bind="props"
        >
          {{ profile.username }}
        </v-btn>
        <!-- User is anonymous (not registered) and signed in -->
        <v-btn
          v-if="profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="$incognito"
          class="text-none incognito"
          stacked
          v-bind="props"
        >
          {{ profile.username }}
        </v-btn>
        <!-- User is not signed in -->
        <v-btn
          v-if="!profile.anonymityConfirmedAt && !profile.email"
          icon="$incognito"
          class="text-none incognito"
          stacked
          v-bind="props"
        />
      </template>
      <v-list>
        <!-- User is registered and signed in -->
        <v-list-item
          v-if="profile.email"
          prepend-icon="$account"
          title="Profile"
          :to="'/users/' + profile.id"
        />
        <v-list-item
          v-if="profile.email"
          prepend-icon="$logout"
          title="Sign out"
          @click="signOut"
        />
        <!-- User is anonymous (not registered) and signed in -->
        <v-list-item
          v-if="profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="$accountPlus"
          title="Register"
          @click="register"
        />
        <v-list-item
          v-if="profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="$logout"
          title="Permanently sign out"
          @click="signOut"
        />
        <!-- User is not signed in -->
        <v-list-item
          v-if="!profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="$account"
          title="Sign In"
          @click="signIn"
        />
        <v-list-item
          v-if="!profile.anonymityConfirmedAt && !profile.email"
          prepend-icon="$accountPlus"
          title="Register"
          @click="register"
        />
        <v-list-item
          v-if="!profile.anonymityConfirmedAt && !profile.email && Object.keys(profile).length > 0"
          prepend-icon="$incognito"
          class="incognito"
          @click="setAnonymous"
        >
          Play anonymously as {{ profile.username }}
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      icon="$themeLightDark"
      @click="toggleTheme"
    />
  </v-app-bar>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item
        :title="'Open Games (' + countOfOpenGames + ')'"
        to="/games/open"
      >
        <template #prepend>
          <v-icon color="primary-darken-1">
            $crown
          </v-icon>
        </template>
      </v-list-item>
      <v-list-item
        v-if="countOfClonedGames > 0"
        title="Your Cloned Games"
        to="/cloned_games"
      >
        <template #prepend>
          <v-icon color="primary-darken-1">
            $contentDuplicate
          </v-icon>
        </template>
      </v-list-item>
      <v-list-item
        title="About"
        to="/about"
      >
        <template #prepend>
          <v-icon color="primary-darken-1">
            $information
          </v-icon>
        </template>
      </v-list-item>
      <v-list-item
        title="Rankings"
        to="/rankings"
      >
        <template #prepend>
          <v-icon color="primary-darken-1">
            $trophy
          </v-icon>
        </template>
      </v-list-item>
      <v-list-item
        title="Join on Discord"
        href="https://discord.gg/Q2Ynzp2Axs"
      >
        <template #prepend>
          <component
            :is="discordLogo"
            class="v-icon v-icon--size-default"
            fill="#5865F2"
          />
        </template>
      </v-list-item>
      <v-list-item
        title="Support on Patreon"
        href="https://www.patreon.com/playimperialclub"
      >
        <template #prepend>
          <component
            :is="patreonLogo"
            class="v-icon v-icon--size-default"
            fill="#f1465a"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { markRaw } from 'vue';
import { useTheme } from 'vuetify';
import discordLogo from '../assets/discord.svg';
import patreonLogo from '../assets/patreon.svg';

export default {
  name: 'Header',
  props: {
    countOfClonedGames: { type: Number, default: 0 },
    countOfOpenGames: { type: String, default: '0' },
    profile: { type: Object, default: () => {} },
  },
  emits: ['anonymity_confirmed', 'signOut'],
  setup() {
    const theme = useTheme();

    return {
      theme,
      toggleTheme: () => { theme.global.name.value = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme'; },
    };
  },
  data: () => ({
    discordLogo: markRaw(discordLogo),
    patreonLogo: markRaw(patreonLogo),
    drawer: false,
    email: '',
    errors: [],
    group: null,
    password: '',
    tempName: '',
  }),
  watch: {
    group() {
      this.drawer = false;
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
