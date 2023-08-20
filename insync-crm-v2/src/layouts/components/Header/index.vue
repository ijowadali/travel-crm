<template>
  <header
    class="bg-default-light dark:bg-default-dark sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-gray-300 p-2 dark:border-gray-800 sm:p-4"
  >
    <div class="flex h-full items-center justify-start space-x-3">
      <NTooltip placement="bottom" trigger="hover">
        <template #trigger>
          <NIcon
            class="cursor-pointer"
            size="20"
            :component="
              sidebarStore.isDisplay ? MenuFoldOutlined : MenuUnfoldOutlined
            "
            @click="sidebarStore.toggleSidebarDisplay"
          />
        </template>
        {{ sidebarStore.isDisplay ? 'Hide' : 'Show' }}
      </NTooltip>

      <Breadcrumb />
    </div>

    <div class="flex h-full items-center justify-end space-x-4">
      <NTooltip placement="bottom" trigger="hover">
        <template #trigger>
          <NIcon
            class="cursor-pointer"
            size="20"
            :component="BrandGithub"
            @click="openNewWindow(teamGitHubURL)"
          />
        </template>
        GitHub
      </NTooltip>

      <template v-if="false">
        <NTooltip placement="bottom" trigger="hover">
          <template #trigger>
            <NIcon
              class="cursor-pointer"
              size="20"
              :component="NotificationsCircleOutline"
            />
          </template>
          Notification
        </NTooltip>
      </template>

      <NTooltip placement="bottom" trigger="hover">
        <template #trigger>
          <NIcon
            class="cursor-pointer"
            size="20"
            :component="
              themeStore.themeMode === 'light' ? SunnyOutline : MoonOutline
            "
            @click="
              themeStore.changeThemeMode(
                themeStore.themeMode === 'light' ? 'dark' : 'light'
              )
            "
          />
        </template>
        SwitchTheme
      </NTooltip>

      <template v-if="false">
        <NTooltip placement="bottom" trigger="hover">
          <template #trigger>
            <NIcon
              class="cursor-pointer"
              size="20"
              :component="SettingsOutline"
            />
          </template>
          Settings
        </NTooltip>
      </template>
      <!-- :src="userStore.user.avatarUrl" -->
      <template v-if="userStore.hasData()">
        <NDropdown
          trigger="hover"
          :options="userOptions"
          @select="selectUserOption"
        >
          <template v-if="userStore.user.avatarUrl">
            <NAvatar
              class="cursor-pointer select-none shadow-md !transition-all hover:opacity-90 active:opacity-70"
              round
              size="small"
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            />
          </template>
          <template v-else>
            <NIcon class="cursor-pointer" size="22" :component="UserCircle" />
          </template>
        </NDropdown>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { BrandGithub, UserCircle } from '@vicons/tabler';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd';
import {
  NotificationsCircleOutline,
  SunnyOutline,
  MoonOutline,
  SettingsOutline,
} from '@vicons/ionicons5';
import { useThemeStore } from '@src/store/modules/theme';
import { useSidebarStore } from '@src/store/modules/sidebar';
import { useUserStore } from '@src/store/modules/user';
import Breadcrumb from '@src/components/Breadcrumb/index.vue';
import { useEnv } from '@src/hooks/useEnv';
import { BrowserUtils } from '@src/utils/browser';
import type { UserOptionKey } from './private';
import { userOptions } from './private';
import { AuthUtils } from '@src/utils/auth';

const { teamGitHubURL } = useEnv();
const { openNewWindow } = BrowserUtils;

const themeStore = useThemeStore();
const sidebarStore = useSidebarStore();
const userStore = useUserStore();
const router = useRouter();
const message = useMessage();
// const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

const logout = async () => {
  return await router.replace('/login').then(() => {
    message.success('Logout Successfully');
    userStore.clearUser();
    AuthUtils.clearToken();
  });
};

const selectUserOption = (key: UserOptionKey) => {
  switch (key) {
    case 'logout':
      logout();
      break;
    case 'profile':
      router.push('/profile');
      break;
    case 'change-password':
      router.push('/change-password');
      break;
    default:
      break;
  }
};
</script>
