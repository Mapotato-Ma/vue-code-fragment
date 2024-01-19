import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('../App.vue') },
  { path: '/scrollDemo', component: () => import('../components/scroll-demo.vue') },
  { path: '/lineGraph', component: () => import('../components/line-graph.vue') },
  { path: '/xstateDemo', component: () => import('../components/xstate-demo.vue') },
  { path: '/useClass', component: () => import('../components/use-class.vue') },
  { path: '/selectBox', component: () => import('../components/select-box.vue') }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
