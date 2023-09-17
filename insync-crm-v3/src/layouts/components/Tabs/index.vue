<template>
  <main
    class="bg-default-light dark:bg-default-dark flex h-12 w-full items-center justify-between border-b border-gray-300 px-2 py-1 shadow dark:border-gray-800 sm:px-4"
  >
    <div
      ref="scrollbarRef"
      class="global_hide-scrollbar flex w-full items-center space-x-2 overflow-x-auto"
      @drop.prevent="dragTabs"
      @dragover.prevent
    >
      <NTag
        v-for="(tagItem, index) in tabStore.tabs"
        :key="tagItem.href"
        class="!cursor-pointer !select-none"
        :type="route.path === tagItem.href ? 'primary' : 'default'"
        :closable="!(tabStore.tabs.length === 1 && tagItem.href === '/')"
        :draggable="true"
        @click="router.push(tagItem.href)"
        @close="handleCloseTab(tagItem, index)"
        @dragstart="setCurrent(index)"
        @dragenter="setReplace(index)"
      >
        {{ tagItem.label }}
        <template #icon>
          <NIcon :component="tagItem.icon" />
        </template>
      </NTag>
    </div>

    <NDivider vertical class="mx-2 sm:mx-4 bg-gray-300 dark:bg-gray-600" />

    <div class="flex shrink-0 items-center space-x-0 sm:space-x-4">
      <div
        class="hidden h-fit cursor-pointer items-center sm:flex"
        :class="[haveScrollBar() ? 'sm:flex' : 'sm:hidden']"
        @mousedown="handleScroll('left')"
        @mouseleave="scrollStop"
        @mouseup="scrollStop"
      >
        <NIcon size="18" :component="ArrowsLeft" />
      </div>

      <div
        class="hidden !rotate-180 cursor-pointer items-center sm:flex"
        :class="[haveScrollBar() ? 'sm:flex' : 'sm:hidden']"
        @mousedown="handleScroll('right')"
        @mouseleave="scrollStop"
        @mouseup="scrollStop"
      >
        <NIcon size="18" :component="ArrowsLeft" />
      </div>

      <NDropdown trigger="hover" :options="tabsOptions" @select="selectTabsOption">
        <NIcon size="20" class="cursor-pointer" :component="DashboardFilled" />
      </NDropdown>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Tab } from '@src/types/tab';
import { DashboardFilled } from '@vicons/material';
import { ArrowsLeft } from '@vicons/tabler';
import type { ScrollDirection, TabsOptionKey } from './private';
import { tabsOptions } from './private';
import { useRoute, useRouter } from 'vue-router';
import { useTabStore } from '@src/store/modules/tab';
import { BrowserUtils } from '@src/utils/browser';

const route = useRoute();
const router = useRouter();
const tabStore = useTabStore();
const record = reactive({
  current: -1,
  replace: -1
});

const selectTabsOption = (key: TabsOptionKey) => {
  switch (key) {
    case 'CLEAR_ALL_TABS':
      tabStore.clearAll();
      router.push('/');
      break;
    default:
      break;
  }
};

let scrollInterval: ReturnType<typeof setInterval> | null = null;

const scrollbarRef = ref<HTMLElement | null>(null);

let animationFrameId: number | null = null;

const handleCloseTab = (tab: Tab, index: number) => {
  if (tab.href === route.path && tabStore.tabs.length > 1) {
    if (index === tabStore.tabs.length - 1) {
      router.push(tabStore.tabs[index - 1].href);
    } else {
      router.push(tabStore.tabs[index + 1].href);
    }
  }

  if (tabStore.tabs.length === 1) {
    router.push('/');
  }

  tabStore.removeTab(index);
};

const scrollLeft = () => {
  if (scrollbarRef.value) {
    const currentScrollLeft = scrollbarRef.value.scrollLeft;
    animationFrameId = BrowserUtils.smoothScroll({
      element: scrollbarRef.value,
      target: currentScrollLeft - 100,
      animationFrameId
    });
  }
};

const scrollRight = () => {
  if (scrollbarRef.value) {
    const currentScrollLeft = scrollbarRef.value.scrollLeft;
    animationFrameId = BrowserUtils.smoothScroll({
      element: scrollbarRef.value,
      target: currentScrollLeft + 100,
      animationFrameId
    });
  }
};

const handleScroll = (direction: ScrollDirection) => {
  switch (direction) {
    case 'left':
      scrollLeft();
      scrollInterval = setInterval(() => scrollLeft(), 100);
      break;
    case 'right':
      scrollRight();
      scrollInterval = setInterval(() => scrollRight(), 100);
      break;
    default:
      break;
  }
};

const scrollStop = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

const haveScrollBar = () => {
  if (scrollbarRef.value) {
    return scrollbarRef.value.scrollWidth > scrollbarRef.value.clientWidth;
  }
  return false;
};

const dragTabs = () => {
  if (record.current === -1 || record.replace === -1) {
    return;
  }
  const [removedValue] = tabStore.tabs.splice(record.current, 1);
  tabStore.tabs.splice(record.replace, 0, removedValue);
};

const setCurrent = (index: number) => {
  record.current = index;
};

const setReplace = (index: number) => {
  record.replace = index;
};
</script>
