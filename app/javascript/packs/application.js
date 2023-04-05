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

import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
/* eslint-disable import/no-unresolved */
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';
/* eslint-enable import/no-unresolved */
import App from '../src/App.vue';
import router from '../src/router';

const lightTheme = {
  dark: false,
  colors: {
    primary: '#A7F3D0',
    'primary-darken-1': '#065F46',
  },
};

const vuetify = createVuetify({
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

const appElement = document.createElement('div');
appElement.setAttribute('id', 'app');
document.body.appendChild(appElement);

app.mount('#app');
