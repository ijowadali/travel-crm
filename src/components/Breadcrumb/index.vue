<template>
  <div class="hidden sm:block">
    <NBreadcrumb>
      <NBreadcrumbItem>
        <NDropdown :options="firstLevelOptions" @select="handleSelect">
          <div class="-mb-2 pb-2">
            <component :is="firstLevelPath" v-if="firstLevelPath" />
          </div>
        </NDropdown>
      </NBreadcrumbItem>
      <NBreadcrumbItem v-if="secondLevelOptions.length > 0">
        <NDropdown :options="secondLevelOptions" @select="handleSelect">
          <div class="-mb-2 cursor-pointer pb-2">
            <component :is="secondLevelPath" v-if="secondLevelPath" />
          </div>
        </NDropdown>
      </NBreadcrumbItem>
    </NBreadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { type MenuOption } from 'naive-ui';
import { menuOptions } from '@src/constants/sidebarItems';
import { router } from '@src/router';

const route = useRoute();

const firstLevelOptions = ref(menuOptions);
const firstLevelPath = ref();

const secondLevelOptions = ref<MenuOption[]>([]);
const secondLevelPath = ref();

const handleSelect = (key: string) => router.push({ name: key });

watch(
  () => route.fullPath,
  () => {
    if (route.fullPath === '/') {
      firstLevelPath.value = '';
      secondLevelPath.value = '';
      secondLevelOptions.value = [];
      return;
    }

    const routePath = route.fullPath.split('/').filter((path) => path !== '');

    const firstLevelOption = firstLevelOptions.value.find((option) => option.key === routePath[0]);
    if (!firstLevelOption) {
      return;
    }
    firstLevelPath.value = firstLevelOption.label;
    if (!firstLevelOption.children) {
      secondLevelOptions.value = [];
      return;
    }

    secondLevelOptions.value = firstLevelOption.children;
    const secondLevelOption = firstLevelOption.children.find(
      (option) => option.key === routePath[1]
    );
    if (!secondLevelOption) {
      secondLevelPath.value = '';
      return;
    }
    secondLevelPath.value = secondLevelOption.label;
  },
  { immediate: true }
);
</script>
