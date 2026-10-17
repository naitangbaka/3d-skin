import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@oreui-web/vue/styles.css';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');