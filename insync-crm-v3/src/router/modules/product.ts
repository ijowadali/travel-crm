import type { RouteRecordRaw } from 'vue-router';
import { CartOutline } from '@vicons/ionicons5';
import { DashboardLayout } from '@src/router/constant';
import { renderIcon } from '@src/utils/renderIcon';

const routeName = 'product';

const routes: RouteRecordRaw[] = [
  {
    path: '/product',
    name: routeName,
    redirect: '/product/list',
    component: DashboardLayout,
    meta: {
      title: 'Products',
      icon: renderIcon(CartOutline),
      permissions: ['can view products'],
      sort: 3
    },
    children: [
      {
        path: 'list',
        name: `${routeName}_list`,
        meta: {
          title: 'Products List',
          permissions: ['can view products']
        },
        component: () => import('@src/views/products/index.vue')
      },
      {
        path: 'add',
        name: `${routeName}_add`,
        meta: {
          title: 'Add Product',
          permissions: ['can view product create'],
          hidden: true
        },
        component: () => import('@src/components/products/AddProduct.vue')
      },
      {
        path: 'update/:id',
        name: `${routeName}_update`,
        meta: {
          title: 'Update Product',
          permissions: ['can view product update'],
          hidden: true
        },
        component: () => import('@src/components/products/EditProduct.vue')
      },
      {
        path: 'attributes',
        name: `${routeName}_attributes`,
        meta: {
          title: 'Attributes',
          permissions: ['can view attributes']
        },
        component: () => import('@src/views/products/attributes/index.vue')
      },
      {
        path: 'categories',
        name: `${routeName}_categories`,
        meta: {
          title: 'Categories',
          permissions: ['can view categories']
        },
        component: () => import('@src/views/products/categories/index.vue')
      }
    ]
  }
];

export default routes;
