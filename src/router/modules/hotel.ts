import type {RouteRecordRaw} from 'vue-router';
import {DashboardLayout} from '@src/router/constant';
import {CartOutline} from '@vicons/ionicons5';
import {renderIcon} from '@src/utils/renderIcon';

const routeName = 'hotel';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/hotel',
        name: routeName,
        redirect: '/hotel/list',
        component: DashboardLayout,
        meta: {
            title: 'Hotels',
            icon: renderIcon(CartOutline),
            permissions: ['can view hotels menu'],
            sort: 3
        },
        children: [
            {
                path: 'List',
                name: `${routeName}_list`,
                meta: {
                    title: 'Hotel List',
                    permissions: ['can view hotels list']
                },
                component: () => import('@src/views/hotels/index.vue')
            },
            {
                path: 'add',
                name: `${routeName}_add`,
                meta: {
                    title: 'Add Hotel',
                    permissions: ['can view hotel create'],
                    hidden: true
                },
                component: () => import('@src/components/hotels/AddHotel.vue')
            },
            {
                path: 'update/:id',
                name: `${routeName}_update`,
                meta: {
                    title: 'Update hotel',
                    permissions: ['can view hotel update'],
                    hidden: true
                },
                component: () => import('@src/components/hotels/EditHotel.vue')
            },
            {
                path: 'room',
                name: `${routeName}_room`,
                meta: {
                    title: 'Rooms',
                    permissions: ['can view rooms menu']
                },
                component: () => import('@src/views/rooms/index.vue')
            }
        ]
    }
];

export default routes;
