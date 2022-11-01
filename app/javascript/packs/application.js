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
import { BrowserTracing } from '@sentry/tracing';
import App from '../src/App.vue';
import router from '../src/router';

const app = createApp(App);

Sentry.init({
  app,
  dsn: 'https://122745012dbe4c0f83ea8309d3aec30f@o987046.ingest.sentry.io/4504086288465920',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['playimperial.club', /^\//],
    }),
  ],
  tracesSampleRate: 0.5,
});

app.use(router);
app.use(VueCookies);

const appElement = document.createElement('div');
appElement.setAttribute('id', 'app');
document.body.appendChild(appElement);

app.mount('#app');
