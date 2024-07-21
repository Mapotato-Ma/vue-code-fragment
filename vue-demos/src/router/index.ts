import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  { path: '', redirect: '/home' },
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'Home',
    meta: { title: '首页' },
    component: () => import('@/views/home-show.vue')
  },
  {
    name: 'IndexNotes',
    path: '/index-notes',
    component: () => import('@/views/index-notes/index-notes.vue')
  },
  {
    name: 'CodepenNotes',
    path: '/codepen-notes',
    component: () => import('@/views/codepen-notes/codepen-notes.vue')
  },
  {
    name: 'JuejinNotes',
    path: '/juejin-notes',
    component: () => import('@/views/juejin-notes/juejin-notes.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
