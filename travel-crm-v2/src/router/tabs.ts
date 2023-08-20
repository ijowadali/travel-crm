import { shallowRef, type VNodeChild } from 'vue';
import { type RouteLocationNormalized } from 'vue-router';
import { useTabStore } from '@src/store/modules/tab';

export const processRouteTag = (to: RouteLocationNormalized) => {
  if (to.meta?.dismissTab) {
    return;
  }

  const tagStore = useTabStore();
  tagStore.addTab({
    href: to.path,
    label: to.meta?.title as string | (() => VNodeChild),
    icon: shallowRef(to.meta?.icon as any),
  });
};
