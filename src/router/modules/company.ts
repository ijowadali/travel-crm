import type { RouteRecordRaw } from 'vue-router';
import { ShopOutlined } from '@vicons/antd';
import { DashboardLayout } from '@src/router/constant';
import { renderIcon } from '@src/utils/renderIcon';

const routeName = 'companies';

const routes: RouteRecordRaw[] = [
  {
    path: '/companies',
    name: routeName,
    redirect: '/companies/list',
    component: DashboardLayout,
    meta: {
      title: 'Companies',
      icon: renderIcon(ShopOutlined),
      permissions: ['can view company'],
      sort: 2
    },
    children: [
      {
        path: 'list',
        name: `${routeName}_list`,
        meta: {
          title: 'Companies',
          permissions: ['can view company']
        },
        component: () => import('@src/views/company/index.vue')
      }
    ]
  }
];

export default routes;
