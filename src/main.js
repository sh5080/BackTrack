import { createApp } from "vue";

import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { store } from "./routes/store";
import LightBootstrap from "./light-bootstrap-main";
import { router } from "./routes/routes";

import "./registerServiceWorker";

loadFonts();
const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(store);
app.use(LightBootstrap);

app.mount("#app");
