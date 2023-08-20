import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { store } from '@src/store';
import { routes } from '@src/router/routes'; // Import the provided route list

interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);
console.log(routes);
function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] {
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

export interface IAsyncRouteState {
  menus: RouteRecordRaw[];
  routers: any[];
  routersAdded: any[];
  keepAliveComponents: string[];
  isDynamicRouteAdded: boolean;
}

export const useAsyncRouteStore = defineStore({
  id: 'app-async-route',
  state: (): IAsyncRouteState => ({
    menus: [],
    routers: [],
    routersAdded: [],
    keepAliveComponents: [],
    isDynamicRouteAdded: false,
  }),
  getters: {
    getMenus(): RouteRecordRaw[] {
      return this.menus;
    },
    getIsDynamicRouteAdded(): boolean {
      return this.isDynamicRouteAdded;
    },
  },
  actions: {
    getRouters() {
      return toRaw(this.routersAdded);
    },
    setDynamicRouteAdded(added: boolean) {
      this.isDynamicRouteAdded = added;
    },
    setRouters(routers: RouteRecordRaw[]) {
      this.routersAdded = routers;
      this.routers = routers; // Update `routers` directly without combining with `constantRouter`
    },
    setMenus(menus: RouteRecordRaw[]) {
      this.menus = menus;
    },
    setKeepAliveComponents(compNames: string[]) {
      this.keepAliveComponents = compNames;
    },
    async generateRoutes(data: any) {
      let accessedRouters: any;
      const permissionsList = data.permissions ?? [];

      const routeFilter = (route: any) => {
        const { meta } = route;
        const { permissions } = meta || {};
        if (!permissions) return true;
        if (data.info.user_type === 'super admin') {
          return true;
        } else {
          return permissionsList.some((item: any) => {
            return permissions.includes(item);
          });
        }
      };
      console.log(routes);

      try {
        accessedRouters = filter(routes, routeFilter);
      } catch (error) {
        console.log(error);
      }

      accessedRouters = accessedRouters.filter(routeFilter);
      this.setRouters(accessedRouters);
      this.setMenus(accessedRouters);
      return toRaw(accessedRouters);
    },
  },
});

export function useAsyncRoute() {
  return useAsyncRouteStore(store);
}
