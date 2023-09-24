<template>
  <div
    class="bg-default-light dark:bg-default-dark absolute inset-y-0 left-0 z-[100] h-full border-r border-gray-300 shadow-sm transition-[width] dark:border-gray-800 sm:static"
    :class="[sidebarStore.isDisplay ? (sidebarStore.isCollapse ? 'w-16' : 'w-56') : 'w-0']"
  >
    <!-- Header -->
    <div class="flex h-14 w-full select-none items-center justify-center" @click="router.push('/')">
      <img
        class="animate-pulse cursor-pointer select-none"
        width="36"
        height="36"
        src="@src/assets/images/bit_ocean.png"
        alt=""
        loading="eager"
      />
      <span
        class="cursor-pointer whitespace-nowrap text-sm tracking-wide transition-all"
        :class="[
          sidebarStore.isDisplay
            ? sidebarStore.isCollapse
              ? 'ml-0 hidden'
              : 'ml-3 w-auto'
            : 'hidden'
        ]"
      >
        {{ appTitle }}
      </span>
    </div>

    <div class="h-[calc(100%-96px)]">
      <NScrollbar :size="10">
        <SideBarItems />
      </NScrollbar>
    </div>

    <div v-if="sidebarStore.isDisplay" class="h-10 w-full p-1">
      <div
        class="hover-container flex h-full w-full cursor-pointer items-center justify-center rounded-sm transition-all"
        @click="() => sidebarStore.toggleSidebarCollapse()"
      >
        <NTooltip placement="bottom" trigger="hover">
          <template #trigger>
            <NIcon
              size="18"
              class="icon-animation transition-all"
              :class="[sidebarStore.isCollapse ? '!rotate-180' : '!rotate-0']"
              :component="MenuFoldOutlined"
            />
          </template>
          {{ sidebarStore.isCollapse ? 'Show' : 'Collapse' }}
        </NTooltip>
      </div>
    </div>
  </div>

  <div
    class="absolute inset-0 z-[75] bg-black opacity-40 sm:hidden"
    :class="sidebarStore.isDisplay ? 'block' : 'hidden'"
    @click="sidebarStore.toggleSidebarDisplay()"
  ></div>
</template>

<script setup lang="ts">
import { MenuFoldOutlined } from '@vicons/antd';
import { useRouter } from 'vue-router';
import { useSidebarStore } from '@src/store/modules/sidebar';
import { SideBarItems } from '@src/layouts/components/menu';
import { useEnv } from '@src/hooks/useEnv';

const router = useRouter();
const { appTitle } = useEnv();
const sidebarStore = useSidebarStore();
</script>

<style scoped lang="scss">
.icon-animation {
  transition: all 0.3s ease-in-out;
}

.hover-container:hover .icon-animation {
  transform: scale(1.2);
  opacity: 0.9;
}

.hover-container:active .icon-animation {
  transform: scale(1);
  opacity: 0.75;
}
</style>
