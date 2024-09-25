import { createRouter, createWebHistory } from 'vue-router';
import MyComponent from '../components/FormComponent.vue';
import PreviewComponent from '../components/PreviewComponent.vue';


const routes = [
  {
    path: '/',
    name: 'home',
    component: MyComponent,
  },
  {
    path: '/preview',
    name: 'preview',
    component: PreviewComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;