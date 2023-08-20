<template>
  <main class="flex h-screen flex-col items-center justify-center">
    <NIcon
      :component="Loading3QuartersOutlined"
      size="60"
      class="text-blue-200 dark:text-blue-400"
    />
    <span class="mb-1 mt-4 text-xl">{{ appTitle }}</span>
    <NGradientText type="primary">Powered by AbendSoft</NGradientText>
  </main>
</template>

<script setup lang="ts">
import { Loading3QuartersOutlined } from '@vicons/antd';
import { useEnv } from '@src/hooks/useEnv';
const { appTitle } = useEnv();
</script>
