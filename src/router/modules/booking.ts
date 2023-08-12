import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ShopOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

const routeName = 'booking';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/booking',
    name: routeName,
    redirect: '/booking/list',
    component: Layout,
    meta: {
      title: 'Bookings',
      icon: renderIcon(ShopOutlined),
      permissions: ['can view bookings menu'],
      sort: 4,
    },
    children: [
      {
        path: 'list',
        name: `${routeName}_list`,
        meta: {
          title: 'Bookings',
          permissions: ['can view bookings'],
        },
        component: () => import('@/views/bookings/index.vue'),
      },
      {
        path: 'add-booking',
        name: `add-${routeName}`,
        meta: {
          title: 'Add Booking',
          permissions: ['can view add booking'],
        },
        component: () => import('@/views/bookings/addBooking.vue'),
      },
      {
        path: 'edit-booking/:id',
        name: `edit-${routeName}`,
        meta: {
          title: 'Edit Booking',
          permissions: ['can view edit booking'],
        },
        component: () => import('@/views/bookings/_id.vue'),
      },
      {
        path: 'print-booking',
        name: `print-${routeName}`,
        meta: {
          title: 'Print Booking',
          permissions: ['can view print booking'],
          hidden: true,
        },
        component: () => import('@/views/bookings/printBooking.vue'),
      },
    ],
  },
];

export default routes;
