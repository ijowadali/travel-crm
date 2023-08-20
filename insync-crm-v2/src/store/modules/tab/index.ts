import { defineStore } from 'pinia';
import type { Tab } from '@src/types/tab';
import { ref } from 'vue';

export const useTabStore = defineStore('tab', () => {
  const tabs = ref<Tab[]>([]);

  const addTab = (tab: Tab) => {
    const exist = tabs.value.some((tabItem) => tabItem.href === tab.href);
    if (exist) {
      return;
    }
    tabs.value.push(tab);
  };

  const removeTab = (index: number) => tabs.value.splice(index, 1);

  const removeTabByHref = (href: string) => {
    const index = tabs.value.findIndex((tab) => tab.href === href);
    if (index !== -1) {
      removeTab(index);
    }
  };

  const clearAll = () => {
    tabs.value = [];
  };

  return {
    tabs,
    addTab,
    removeTab,
    removeTabByHref,
    clearAll,
  };
});
