import { RouteRecordRaw } from 'vue-router';

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'root',
  redirect: '/dashboard',
  meta: {
    title: 'Root',
  },
};
