<template>
  <main class="flex h-screen w-screen">
    <div
      class="invisible relative w-0 bg-blue-200 dark:bg-gray-600 sm:visible sm:w-1/2"
    >
      <div
        class="absolute inset-0 m-auto flex h-fit w-fit select-none flex-col space-y-2 text-center font-mono"
      >
        <img
          src="@src/assets/images/favicon.png"
          alt=""
          width="180"
          height="180"
          loading="eager"
        />
        <span class="text-xl font-semibold">{{ appTitle }}</span>
        <span class="text-base">v{{ version }}</span>
      </div>
    </div>

    <div class="relative w-full bg-blue-300 dark:bg-gray-700 sm:w-1/2">
      <RouterView v-slot="{ Component }">
        <component :is="Component" class="animation-switch" />
      </RouterView>
    </div>
    <ThemeSwitchDevTool />
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useEnv } from '@src/hooks/useEnv';
import { useUserStore } from '@src/store/modules/user';
import { AuthUtils } from '@src/utils/auth';
import ThemeSwitchDevTool from '@src/components/ThemeSwitchDevTool/index.vue';

const { version, appTitle } = useEnv();

const userStore = useUserStore();
const router = useRouter();

const checkLogin = () => {
  if (AuthUtils.isAuthenticated()) {
    router.replace('/');
  } else {
    userStore.clearUser();
  }
};

onBeforeMount(() => checkLogin());
</script>

<style scoped lang="scss">
.animation-switch {
  animation: switch 1s;
}

@keyframes switch {
  0% {
    transform: translateY(-1000px);
    opacity: 0;
  }
  50% {
    transform: translateY(0px);
  }
  75% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
@src/store/modules/user
