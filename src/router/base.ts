import { ErrorPage, RedirectName, DashboardLayout } from '@src/router/constant';
import type { RouteRecordRaw } from 'vue-router';

// 404 on a page
export const ErrorPageRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: DashboardLayout,
  meta: {
    title: 'ErrorPage',
    dismissTab: true
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'ErrorPageSon',
      component: ErrorPage,
      meta: {
        title: 'ErrorPage',
        dismissTab: true
      }
    }
  ]
};

export const RedirectRoute: RouteRecordRaw = {
  path: '/redirect',
  name: RedirectName,
  component: DashboardLayout,
  meta: {
    title: RedirectName,
    dismissTab: true
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: RedirectName,
      component: () => import('@src/views/redirect/index.vue'),
      meta: {
        title: RedirectName,
        dismissTab: true
      }
    }
  ]
};
