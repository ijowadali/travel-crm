<template>
  <footer
    class="bg-default-light dark:bg-default-dark z-50 flex h-10 w-full items-center justify-center space-x-2 border-t border-gray-300 text-xs shadow-sm dark:border-gray-950"
  >
    <span>{{ appTitle }} - v{{ version }}</span>
    <span>©</span>
    <img
      class="-mb-2 cursor-pointer pb-2 transition-all hover:-translate-y-1 hover:scale-110 active:-translate-y-0 active:scale-105 active:opacity-75"
      src="@src/assets/images/bit_ocean.png"
      alt=""
      loading="eager"
      width="18"
      @click="openNewWindow(teamGitHubURL)"
    />
    <span>{{ teamName }}</span>
  </footer>
</template>

<script setup lang="ts">
import { useEnv } from '@src/hooks/useEnv';
import { BrowserUtils } from '@src/utils/browser';

const { appTitle, version, teamName, teamGitHubURL } = useEnv();

const { openNewWindow } = BrowserUtils;
</script>
