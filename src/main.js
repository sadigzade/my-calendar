import { createApp } from "vue";
import store from "./store/store";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

import "./style.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

const app = createApp(App);

app.config.globalProperties.$log = console.log;

app.use(PrimeVue);
app.use(store);

app.component("Dialog", Dialog);
app.component("InputText", InputText);
app.component("Button", Button);

app.mount("#app");
