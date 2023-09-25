<script setup lang="ts">
import { useThemeStore } from '@src/store/modules/theme';
import { ToolOutlined } from '@vicons/antd';

const themeStore = useThemeStore();
</script>

<template>
  <div
    class="bg-default-light dark:bg-default-dark fixed bottom-20 right-10 z-[1000] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-2 shadow-md transition-colors"
    @click="() => themeStore.changeThemeMode(themeStore.themeMode === 'light' ? 'dark' : 'light')"
  >
    <ToolOutlined class="dark:text-white" />
  </div>
</template>
