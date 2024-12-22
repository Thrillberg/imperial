/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

import { createApp } from 'vue';
import VueCookies from 'vue3-cookies';

import * as Sentry from '@sentry/vue';

import { createVuetify } from 'vuetify';
/* eslint-disable import/no-unresolved */
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import * as components from 'vuetify/components';
/* eslint-enable import/no-unresolved */
import {
  mdiAccount,
  mdiAccountGroup,
  mdiAccountPlus,
  mdiBookOpenVariant,
  mdiCircle,
  mdiCircleMedium,
  mdiClose,
  mdiContentDuplicate,
  mdiCrown,
  mdiEmailOutline,
  mdiFlag,
  mdiFullscreen,
  mdiHelpCircleOutline,
  mdiHome,
  mdiIncognito,
  mdiInformation,
  mdiLogout,
  mdiScriptTextOutline,
  mdiStar,
  mdiThemeLightDark,
  mdiTimerSand,
  mdiTrophy,
} from '@mdi/js';
import '../styles/site.scss';

import { VueMasonryPlugin } from 'vue-masonry';
import { nationColors } from '../../../nationColors';
import App from '../src/App.vue';
import router from '../src/router';

const darkTheme = {
  dark: true,
  colors: {
    primary: '#517564',
    'primary-darken-1': '#3e594c',
    secondary: '#bab291',
    ...nationColors,
  },
};

const lightTheme = {
  dark: false,
  colors: {
    primary: '#A7F3D0',
    'primary-darken-1': '#065F46',
    secondary: '#fef3c7',
    ...nationColors,
  },
};

const vuetify = createVuetify({
  components,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      account: mdiAccount,
      accountGroup: mdiAccountGroup,
      accountPlus: mdiAccountPlus,
      bookOpenVariant: mdiBookOpenVariant,
      close: mdiClose,
      circle: mdiCircle,
      circleMedium: mdiCircleMedium,
      contentDuplicate: mdiContentDuplicate,
      crown: mdiCrown,
      emailOutline: mdiEmailOutline,
      flag: mdiFlag,
      fullscreen: mdiFullscreen,
      helpCircleOutline: mdiHelpCircleOutline,
      home: mdiHome,
      incognito: mdiIncognito,
      information: mdiInformation,
      logout: mdiLogout,
      scriptTextOutline: mdiScriptTextOutline,
      star: mdiStar,
      themeLightDark: mdiThemeLightDark,
      timerSand: mdiTimerSand,
      trophy: mdiTrophy,
    },
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      darkTheme,
      lightTheme,
    },
  },
});

document.addEventListener('DOMContentLoaded', () => {
  const app = createApp(
    App,
    { env: process.env.NODE_ENV, initialGames: window.initialGames },
  ).use(vuetify);

  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      app,
      dsn: 'https://cd525e4c75fe2fd58a52ac7cc91acee9@o987046.ingest.sentry.io/4506082726445056',
      integrations: [
        Sentry.browserTracingIntegration({ router }),
        Sentry.replayIntegration(),
        Sentry.breadcrumbsIntegration(),
      ],
      tracePropagationTargets: ['localhost', /^https:\/\/playimperial\.club/],
      // Performance Monitoring
      tracesSampleRate: 0.5, // Capture 50% of the transactions
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }

  app.use(router);
  app.use(VueCookies);
  app.use(VueMasonryPlugin);

  const appElement = document.createElement('div');
  appElement.setAttribute('id', 'app');
  document.body.appendChild(appElement);

  app.mount('#app');
});
