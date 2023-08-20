import { RouteRecordRaw } from 'vue-router';
import { DashboardOutlined } from '@vicons/antd';

export const DashboardRoute: RouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  redirect: '/dashboard',
  component: () => import('@src/layouts/DashbaordLayout/index.vue'),
  children: [
    {
      path: '',
      name: 'dashbaord',
      meta: {
        title: 'Dashboard',
        icon: DashboardOutlined,
        permissions: ['can view dashboard'],
      },
      component: () => import('@src/views/dashboard/index.vue'),
    },
    {
      path: 'system/users',
      name: 'users',
      meta: {
        title: 'Users',
        // permissions: ['can view users'],
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/users/index.vue'),
    },
    {
      path: 'profile',
      name: 'profile',
      meta: {
        title: 'Profile',
        permissions: ['can view profile'],
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/users/Profile.vue'),
    },
    {
      path: 'system/permissions',
      name: 'permissions',
      meta: {
        title: 'Permissions',
        permissions: ['can view permissions'],
      },
      // component: { template: '<div>Home</div>' },
      component: () => import('@src/views/permissions/index.vue'),
    },
    {
      path: 'system/roles',
      name: 'roles',
      meta: {
        title: 'Roles',
        permissions: ['can view roles'],
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/roles/index.vue'),
    },
    {
      path: 'companies',
      name: 'companies',
      meta: {
        title: 'companies',
        permissions: ['can view company'],
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/company/index.vue'),
    },
    {
      path: 'hotels/list',
      name: 'hotels',
      meta: {
        title: 'Hotels',
        permissions: ['can view hotels'],
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/hotels/index.vue'),
    },
    {
      path: 'hotels/add',
      name: 'hotel_add',
      meta: {
        title: 'Add Hotel',
        permissions: ['can view add hotel'],
        // hidden: true,
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/components/hotels/AddHotel.vue'),
    },
    {
      path: 'hotels/update/:id',
      name: 'hotel_update',
      meta: {
        title: 'Update hotel',
        permissions: ['can view update hotel'],
        // hidden: true,
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/components/hotels/EditHotel.vue'),
    },
    {
      path: 'rooms/list',
      name: 'rooms_list',
      meta: {
        title: 'Rooms',
        permissions: ['can view room'],
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/rooms/index.vue'),
    },
    {
      path: 'booking/list',
      name: 'booking_list',
      meta: {
        title: 'Bookings',
        permissions: ['can view bookings'],
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/bookings/index.vue'),
    },
    {
      path: 'booking/add',
      name: 'booking_add',
      meta: {
        title: 'Add Booking',
        permissions: ['can view add booking'],
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/bookings/addBooking.vue'),
    },
    {
      path: 'booking/update/:id',
      name: 'booking_update',
      meta: {
        title: 'Edit Booking',
        permissions: ['can view edit booking'],
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/bookings/_id.vue'),
    },
    {
      path: 'booking/print',
      name: 'booking_print',
      meta: {
        title: 'Print Booking',
        permissions: ['can view print booking'],
        hidden: true,
      },
      component: { template: '<div>Home</div>' },
      // component: () => import('@/views/bookings/printBooking.vue'),
    },
  ],
};
