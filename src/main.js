import { createApp } from 'vue';
import App from './App.vue';
import './style/style.css'; // Import the CSS file
import router from './router'; // Импортируем роутер

const app = createApp(App);
app.use(router); // Подключаем роутер
app.mount('#app');