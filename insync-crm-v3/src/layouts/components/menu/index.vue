<template>
  <NMenu
    :options="menuItemList"
    :collapsed-width="64"
    :collapsed="sidebarStore.isCollapse"
    :collapsed-icon-size="20"
    :indent="24"
    :expanded-keys="state.openKeys"
    :value="selectedKeys"
    @update:value="clickMenuItem"
    @update:expanded-keys="menuExpanded"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAsyncRouteStore } from '@src/store/modules/asyncRoute';
import { useSidebarStore } from '@src/store/modules/sidebar';
import { generatorMenu } from '@src/utils/router/sidebarGenerator';

const currentRoute = useRoute();
const router = useRouter();
const asyncRouteStore = useAsyncRouteStore();
const sidebarStore = useSidebarStore();
const menuItemList = ref<any[]>([]);
const selectedKeys = ref<string>(currentRoute.name as string);
const emit = defineEmits(['clickMenuItem']);
const matched = currentRoute.matched;
const getOpenKeys: any = matched && matched.length ? matched.map((item) => item.name) : [];

const state = reactive({
  openKeys: getOpenKeys
});

watch(
  () => currentRoute.fullPath,
  () => {
    updateMenu();
  }
);

function updateSelectedKeys() {
  const matched = currentRoute.matched;
  state.openKeys = matched.map((item) => item.name);
  const activeMenu: string = (currentRoute.meta?.activeMenu as string) || '';
  selectedKeys.value = activeMenu ? (activeMenu as string) : (currentRoute.name as string);
}

function updateMenu() {
  menuItemList.value = generatorMenu(asyncRouteStore.getMenus);
  updateSelectedKeys();
}

function clickMenuItem(key: string) {
  if (/http(s)?:/.test(key)) {
    window.open(key);
  } else {
    router.push({ name: key });
  }
  emit('clickMenuItem' as any, key);
}

function menuExpanded(openKeys: string[]) {
  if (!openKeys) return;
  const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1);
  const isExistChildren = findChildrenLen(latestOpenKey as string);
  state.openKeys = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : openKeys;
}

function findChildrenLen(key: string) {
  if (!key) return false;
  const subRouteChildren: string[] = [];
  for (const { children, key } of unref(menuItemList)) {
    if (children && children.length) {
      subRouteChildren.push(key as string);
    }
  }
  return subRouteChildren.includes(key);
}

onMounted(() => {
  updateMenu();
});
</script>
