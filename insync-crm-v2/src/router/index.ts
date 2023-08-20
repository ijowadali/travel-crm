import { App } from 'vue';
import NProgress from 'nprogress';
import { createRouter, createWebHistory } from 'vue-router';
import { SiteUtils } from '@src/utils/site';
import { processRouteTag } from '@src/router/tabs';
import { routes } from './routes';

NProgress.configure({ showSpinner: false });

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start();
  }
  next();
});

router.afterEach((to) => {
  SiteUtils.setDocumentTitle(to.meta.title);
  processRouteTag(to);
  NProgress.done();
});

export function setupRouter(app: App) {
  app.use(router);
}
