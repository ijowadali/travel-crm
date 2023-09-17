import { defineStore } from 'pinia';
import { toRaw } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { asyncRoutes, constantRouter } from '@src/router';
import { useUserStore } from '@src/store/modules/user';
import { ref, computed } from 'vue';

interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid'
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

export interface IAsyncRouteState {
  menus: RouteRecordRaw[];
  routers: any[];
  routersAdded: any[];
  keepAliveComponents: string[];
  isDynamicRouteAdded: boolean;
}

async function RouteFilter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): Promise<T[]> {
  config = getConfig(config);
  const children = config.children as string;

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }

  return listFilter(tree);
}

export const useAsyncRouteStore = defineStore('app-route', () => {
  const menus = ref<RouteRecordRaw[]>([]);
  const routers = ref<any[]>(constantRouter);
  const routersAdded = ref<any[]>([]);
  const keepAliveComponents = ref<string[]>([]);
  const isDynamicRouteAdded = ref<boolean>(false);

  const getMenus = computed(() => menus.value);

  const getIsDynamicRouteAdded = computed(() => isDynamicRouteAdded.value);

  const setDynamicRouteAdded = (added: boolean) => {
    isDynamicRouteAdded.value = added;
  };

  const setRouters = (newRouters: RouteRecordRaw[]) => {
    routersAdded.value = newRouters;
    routers.value = constantRouter.concat(newRouters);
  };

  const setMenus = (newMenus: RouteRecordRaw[]) => {
    menus.value = newMenus;
  };

  const setKeepAliveComponents = (compNames: string[]) => {
    keepAliveComponents.value = compNames;
  };

  const generateRoutes = async (permissions: any) => {
    const permissionsList = permissions ?? [];
    // check Role
    const userStore = useUserStore();
    const role = userStore.currentUser?.roles?.find((item: any) => item.name === 'super admin');

    const routeFilter = (route: any) => {
      const { meta } = route;
      const { permissions } = meta || {};
      if (!permissions) return true;
      if (role && role.name === 'super admin') {
        return true;
      } else {
        return permissionsList.some((item: any) => {
          return permissions.includes(item);
        });
      }
    };

    const res = await RouteFilter(asyncRoutes, routeFilter);
    const routeList = res.filter(routeFilter);
    setRouters(routeList);
    setMenus(routeList);

    return toRaw(routeList);
  };

  return {
    getMenus,
    getIsDynamicRouteAdded,
    setDynamicRouteAdded,
    keepAliveComponents,
    setKeepAliveComponents,
    generateRoutes
  };
});
