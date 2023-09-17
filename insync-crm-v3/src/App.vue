<template>
  <div class="display-content bg-layout-light dark:bg-layout-dark">
    <NConfigProvider
      :theme="themeStore.theme"
      :theme-overrides="themeStore.themeOverrides"
      abstract
      inline-theme-disabled
    >
      <NLoadingBarProvider>
        <n-dialog-provider>
          <NNotificationProvider>
            <NMessageProvider>
              <RouterView v-slot="{ Component }">
                <template v-if="Component">
                  <Transition name="router" mode="out-in">
                    <component :is="Component" class="text-base" />
                  </Transition>
                </template>
              </RouterView>
            </NMessageProvider>
          </NNotificationProvider>
        </n-dialog-provider>
      </NLoadingBarProvider>
      <NGlobalStyle />
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@src/store/modules/theme';
import { NGlobalStyle } from 'naive-ui';

const themeStore = useThemeStore();
</script>

<style scoped lang="scss">
.router-enter-active,
.router-leave-active {
  transition: opacity 0.3s ease;
}
.router-enter-from,
.router-leave-to {
  opacity: 0;
}

@media print {
  .display-content {
    display: none;
  }
}
</style>
