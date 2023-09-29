import type {RouteRecordRaw} from 'vue-router';
import {CartOutline} from '@vicons/ionicons5';
import {DashboardLayout} from '@src/router/constant';
import {renderIcon} from '@src/utils/renderIcon';

const routeName = 'booking';

const routes: RouteRecordRaw[] = [
    {
        path: '/booking',
        name: routeName,
        redirect: '/booking/list',
        component: DashboardLayout,
        meta: {
            title: 'Bookings',
            icon: renderIcon(CartOutline),
            permissions: ['can view bookings menu'],
            sort: 4
        },
        children: [
            {
                path: 'list',
                name: `${routeName}_list`,
                meta: {
                    title: 'Booking List',
                    permissions: ['can view bookings list']
                },
                component: () => import('@src/views/bookings/index.vue')
            },
            {
                path: 'add',
                name: `${routeName}_add`,
                meta: {
                    title: 'Add booking',
                    permissions: ['can view booking create']
                },
                component: () => import('@src/views/bookings/addBooking.vue')
            },
            {
                path: 'update/:id',
                name: `${routeName}_update`,
                meta: {
                    title: 'Update booking',
                    permissions: ['can view booking update'],
                    hidden: true
                },
                component: () => import('@src/views/bookings/_id.vue')
            },
            {
                path: 'print/:id',
                name: `${routeName}_print`,
                meta: {
                    title: 'Print booking',
                    permissions: ['can view booking print'],
                    hidden: true
                },
                component: () => import('@src/views/bookings/_id.vue')
            }
        ]
    }
];

export default routes;
