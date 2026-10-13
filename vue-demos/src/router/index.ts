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
  /**
   * 关键：顶栏那几个是页内锚点（#works / #stack / #content）。
   * vue-router 会把它们当成一次导航，如果这里不认 hash 就会被兜回页面顶部
   * —— 表现就是「点了没反应」。
   */
  scrollBehavior: (to, _from, saved) => {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 72, behavior: 'smooth' };
    return { top: 0 };
  },
});
