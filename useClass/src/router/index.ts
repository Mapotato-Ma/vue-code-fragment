import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: '首页', component: () => import('../components/home-show.vue') },
  { name: '表格滚动demo', path: '/scrollDemo', component: () => import('../components/scroll-demo.vue') },
  { name: '连线demo', path: '/lineGraph', component: () => import('../components/line-graph.vue') },
  { name: 'XstateDemo', path: '/xstateDemo', component: () => import('../components/xstate-demo.vue') },
  { name: 'UnusedDemo', path: '/useClass', component: () => import('../components/use-class.vue') },
  { name: 'SelectBoxDemo', path: '/selectBox', component: () => import('../components/select-box.vue') },
  {
    name: '伸缩排序demo',
    path: '/flexible-layouts',
    component: () => import('../components/flexible-layouts.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
