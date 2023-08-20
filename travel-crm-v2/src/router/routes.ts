import { RouteRecordRaw } from 'vue-router';
import { RootRoute } from '@src/router/modules/root';
import { LoginRoute } from '@src/router/modules/login';
import { DashboardRoute } from '@src/router/modules/dashboard';

export const routes: RouteRecordRaw[] = [LoginRoute, RootRoute, DashboardRoute];
