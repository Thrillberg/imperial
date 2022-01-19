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

import 'regenerator-runtime/runtime'

import { createApp } from "vue";
import App from "../src/App.vue";
import router from "../src/router";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://fd248a7ee8904fec99cfee9a4ea6f51c@o987046.ingest.sentry.io/5943913",
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ["imperial.club", /^\//],
    }),
  ],
  tracesSampleRate: 1.0,
  environment: "production",
});

app.use(router).mount("#app");
