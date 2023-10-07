import { createApp } from "vue";

import SidebarPlugin from "./components/SidebarPlugin";

// asset imports
import "bootstrap/dist/css/bootstrap.css";
// import "./assets/sass/light-bootstrap-dashboard.scss";
// import "./assets/css/demo.css";

// Create a Vue app instance
const app = createApp({});

app.use(SidebarPlugin);

export default app;
