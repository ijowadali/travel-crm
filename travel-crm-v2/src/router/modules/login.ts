import { RouteRecordRaw } from 'vue-router';

// const routeName = 'login';

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'auth-layout',
  component: () => import('@src/layouts/AuthLayout/index.vue'),
  meta: {
    title: 'Login',
  },
  children: [
    {
      path: '',
      name: 'login',
      component: () => import('@src/views/login/index.vue'),
      meta: {
        title: 'Login',
        dismissTab: true,
      },
    },
  ],
};
