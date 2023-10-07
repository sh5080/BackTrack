import { createApp } from "vue";
import axios from "axios";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { store } from "./store/index";
import LightBootstrap from "./light-bootstrap-main";
import { router } from "./routes/routes";
import { SocketPlugin } from "./plugins/socketPlugin";
// import "./registerServiceWorker";

const serverUrl = "http://localhost:4000";

const app = createApp(App);
app.config.globalProperties.$axios = axios.create({
  baseURL: serverUrl,
});

loadFonts();
app.use(SocketPlugin);

app.use(router);
app.use(store);
app.use(vuetify);
// app.use(LightBootstrap);

app.mount("#app");
