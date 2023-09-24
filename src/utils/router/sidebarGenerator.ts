import { PageEnum } from '@src/enums/pageEnum';

/**
 * Recursive assembly menu format
 */
export function generatorMenu(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? item.children[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
      icon: isRoot ? item.meta?.icon : info.meta?.icon,
    };
    // Whether there is a submenu and process it recursively
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = generatorMenu(info.children);
    }
    return currentMenu;
  });
}

/**
 * Determine the root route Router
 * */
function isRootRouter(item: any) {
  return (
    item.meta?.alwaysShow != true &&
    item?.children?.filter((item: any) => !item?.meta?.hidden)?.length === 1
  );
}

/**
 * Exclude Router
 * */
function filterRouter(routerMap: Array<any>) {
  return routerMap.filter((item) => {
    return (
      (item.meta?.hidden || false) != true &&
      !['/:path(.*)*', '/', PageEnum.REDIRECT, PageEnum.BASE_LOGIN].includes(
        item.path
      )
    );
  });
}
