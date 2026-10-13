import { createRouter, createWebHistory } from 'vue-router';

/**
 * 全站只有一页（作品展示）。任何路径都落到同一页，锚点交给浏览器处理。
 * base 由 vite 的 base=/mapotato 注入（import.meta.env.BASE_URL）。
 */
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'Showcase',
      component: () => import('@/views/showcase/showcase.vue'),
      meta: { title: 'Mapotato · 作品' },
    },
  ],
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
});
