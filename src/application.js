import { createApp } from 'vue';
import VueCookies from 'vue3-cookies';

import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
/* eslint-disable import/no-unresolved */
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';
/* eslint-enable import/no-unresolved */
import router from '../app/javascript/src/router';
import nationColors from '../nationColors';
import App from './App.vue';

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
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
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

const app = createApp(App, { env: process.env.NODE_ENV }).use(vuetify);

app.use(router);
app.use(VueCookies);

if (process.env.NODE_ENV === 'production') {
  const googleTagManagerHead = document.createElement('script');
  googleTagManagerHead.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TPLXHT2');`;
  document.head.appendChild(googleTagManagerHead);

  const googleTagManagerBody = document.createElement('noscript');
  const iFrame = document.createElement('iframe');
  iFrame.setAttribute('src', 'https://www.googletagmanager.com/ns.html?id=GTM-TPLXHT2');
  iFrame.setAttribute('height', 0);
  iFrame.setAttribute('width', 0);
  iFrame.setAttribute('style', 'display:none;visibility:hidden');
  googleTagManagerBody.appendChild(iFrame);
  document.body.appendChild(googleTagManagerBody);
}

app.mount('#app');
