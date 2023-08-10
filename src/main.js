import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { router, store } from "./router/index.js";

createApp(App).use(vuetify).use(router).use(store).mount("#app");
