import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './tailwind.css'
import App from './App.vue'
import router from './router';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);
app.use(router,Vue3Toastify, {
  autoClose: 5000,
  theme: 'colored',
  position: 'top-right',
});
app.mount('#app');
