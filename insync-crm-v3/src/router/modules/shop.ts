import type { RouteRecordRaw } from 'vue-router';
import { ShopOutlined } from '@vicons/antd';
import { DashboardLayout } from '@src/router/constant';
import { renderIcon } from '@src/utils/renderIcon';

const routeName = 'shop';

const routes: RouteRecordRaw[] = [
  {
    path: '/shop',
    name: routeName,
    redirect: '/shop/list',
    component: DashboardLayout,
    meta: {
      title: 'Shop',
      icon: renderIcon(ShopOutlined),
      permissions: ['can view shops'],
      sort: 2
    },
    children: [
      {
        path: 'list',
        name: `${routeName}_list`,
        meta: {
          title: 'Shop List',
          permissions: ['can view shops']
        },
        component: () => import('@src/views/shop/index.vue')
      }
    ]
  }
];

export default routes;
