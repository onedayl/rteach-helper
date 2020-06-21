import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
  }, {
    path: '/guide',
    name: 'Guide',
    component: () => import('../views/Guide.vue'),
  }, {
    path: '/console',
    name: 'Console',
    component: () => import('../views/Console.vue'),
  }]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
