import type { RouteRecordRaw } from 'vue-router';
import { SettingsOutline } from '@vicons/ionicons5';
import { DashboardLayout } from '@src/router/constant';
import { renderIcon } from '@src/utils/renderIcon';

const routeName = 'system';

const routes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: routeName,
    redirect: '/system/users',
    component: DashboardLayout,
    meta: {
      title: 'System Settings',
      permissions: ['can view system setting'],
      icon: renderIcon(SettingsOutline),
      sort: 1
    },
    children: [
      {
        path: 'users',
        name: `${routeName}_users`,
        meta: {
          title: 'Users',
          permissions: ['can view users']
        },
        component: () => import('@src/views/users/index.vue')
      },
      {
        path: 'profile',
        name: `${routeName}_profile`,
        meta: {
          title: 'Profile',
          permissions: ['can view profile'],
          hidden: true
        },
        component: () => import('@src/views/users/Profile.vue')
      },
      {
        path: 'shop',
        name: `${routeName}_shop`,
        meta: {
          title: 'Shop',
          permissions: ['can view profile'],
          hidden: true
        },
        component: () => import('@src/views/users/UserShop.vue')
      },
      {
        path: 'assing-permission',
        name: `${routeName}_assing_permission`,
        meta: {
          title: 'Assing Permission',
          permissions: ['can view profile'],
          hidden: true
        },
        component: () => import('@src/components/permission/AssignPermissions.vue')
      },
      {
        path: 'role',
        name: `${routeName}_role`,
        meta: {
          title: 'Roles',
          permissions: ['can view roles']
        },
        component: () => import('@src/views/roles/index.vue')
      },
      {
        path: 'permissions',
        name: `${routeName}_permission`,
        meta: {
          title: 'Permissions',
          permissions: ['can view permissions']
        },
        component: () => import('@src/views/permissions/index.vue')
      }
    ]
  }
];

export default routes;
