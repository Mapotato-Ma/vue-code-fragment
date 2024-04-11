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
  // {
  //   name: '固定第一行第一列滚动',
  //   path: '/scrollDemo',
  //   component: () => import('@/views/scroll-demo.vue')
  // },
  {
    name: 'LineGraph',
    path: '/line-graph',
    meta: { title: 'css连线' },
    component: () => import('@/views/line-graph.vue')
  },
  // { name: 'UnusedDemo', path: '/useClass', component: () => import('@/views/use-class.vue') },
  {
    name: 'SelectBox',
    path: '/select-box',
    meta: { title: 'SelectBox' },
    component: () => import('@/views/select-box.vue')
  },
  {
    name: 'FlexibleLayouts',
    meta: { title: '拖拽排序' },
    path: '/flexible-layouts',
    component: () => import('@/views/flexible-layouts.vue')
  },
  {
    name: 'DirectedGraph',
    meta: { title: '无向图' },
    path: '/directed-graph',
    component: () => import('@/views/directed-graph/directed-graph.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
