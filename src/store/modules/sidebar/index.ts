import { defineStore } from 'pinia';
import { ref } from 'vue';
import { BrowserUtils } from '@src/utils/browser';

export const useSidebarStore = defineStore('app-sidebar', () => {
  const isCollapse = ref(false);

  const isDisplay = ref(!BrowserUtils.isMobileDevice());

  const changeSidebarCollapse = (value: boolean) => {
    isCollapse.value = value;
  };

  const toggleSidebarCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };

  const changeSidebarDisplay = (value: boolean) => {
    isDisplay.value = value;
  };

  const toggleSidebarDisplay = () => {
    isDisplay.value = !isDisplay.value;
  };

  return {
    isCollapse,
    isDisplay,
    changeSidebarCollapse,
    toggleSidebarCollapse,
    changeSidebarDisplay,
    toggleSidebarDisplay
  };
});
