import type { RouteRecordRaw } from 'vue-router';
import { DashboardOutlined } from '@vicons/antd';
import { DashboardLayout } from '@src/router/constant';
import { renderIcon } from '@src/utils/renderIcon';

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard-layout',
    redirect: '/dashboard',
    component: DashboardLayout,
    meta: {
      title: 'Dashboard',
      icon: renderIcon(DashboardOutlined),
      permissions: ['can view dashboard'],
      sort: 0
    },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: 'Dashboard',
          icon: renderIcon(DashboardOutlined),
          permissions: ['can view dashboard']
        },
        component: () => import('@src/views/dashboard/index.vue')
      }
    ]
  }
];

export default routes;
