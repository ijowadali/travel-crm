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
            :component="sidebarStore.isDisplay ? MenuFoldOutlined : MenuUnfoldOutlined"
            @click="sidebarStore.toggleSidebarDisplay"
          />
        </template>
        {{ sidebarStore.isDisplay ? 'Hide' : 'Show' }}
      </NTooltip>

      <!-- <Breadcrumb /> -->
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

      <!-- <template v-if="true">
        <NTooltip placement="bottom" trigger="hover">
          <template #trigger>
            <NIcon class="cursor-pointer" size="20" :component="NotificationsCircleOutline" />
          </template>
          Notification
        </NTooltip>
      </template> -->

      <NTooltip placement="bottom" trigger="hover">
        <template #trigger>
          <NIcon
            class="cursor-pointer"
            size="20"
            :component="themeStore.themeMode === 'light' ? SunnyOutline : MoonOutline"
            @click="themeStore.changeThemeMode(themeStore.themeMode === 'light' ? 'dark' : 'light')"
          />
        </template>
        SwitchTheme
      </NTooltip>

      <!-- <template v-if="true">
        <NTooltip placement="bottom" trigger="hover">
          <template #trigger>
            <NIcon class="cursor-pointer" size="20" :component="SettingsOutline" />
          </template>
          Settings
        </NTooltip>
      </template> -->
      <!-- :src="userStore.user.avatarUrl" -->
      <template v-if="userStore.hasData()">
        <NDropdown trigger="click" :options="userOptions" @select="selectUserOption">
          <template v-if="userStore.currentUser.profile.profile_picture">
            <NAvatar
              class="cursor-pointer select-none shadow-md !transition-all hover:opacity-90 active:opacity-70"
              round
              size="small"
              :src="`${imgUrl}${userStore.currentUser.profile.profile_picture}`"
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
import { h } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage, NAvatar, NText } from 'naive-ui';
import { BrandGithub, UserCircle } from '@vicons/tabler';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  UnlockOutlined,
  LogoutOutlined
} from '@vicons/antd';
import {
  // NotificationsCircleOutline,
  SunnyOutline,
  MoonOutline,
  SettingsOutline
} from '@vicons/ionicons5';
import { useThemeStore } from '@src/store/modules/theme';
import { useSidebarStore } from '@src/store/modules/sidebar';
import { useUserStore } from '@src/store/modules/user';
// import Breadcrumb from '@src/components/Breadcrumb/index.vue';
import { useEnv } from '@src/hooks/useEnv';
import { BrowserUtils } from '@src/utils/browser';
import { renderIcon } from '@src/utils/renderIcon';

const { teamGitHubURL, imgUrl } = useEnv();
const { openNewWindow } = BrowserUtils;

const themeStore = useThemeStore();
const sidebarStore = useSidebarStore();
const userStore = useUserStore();
const router = useRouter();
const message = useMessage();
// const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

const logout = async () => {
  return await router.replace('/login').then(async () => {
    const res = await userStore.logout();
    message.success(res.message);
  });
};

type UserOptionKey = 'logout' | 'profile' | 'change-password' | 'shop_setting';

const selectUserOption = (key: UserOptionKey) => {
  switch (key) {
    case 'logout':
      logout();
      break;
    case 'profile':
      router.push({ name: 'system_profile' });
      break;
    case 'change-password':
      router.push('/change-password');
      break;
    case 'shop_setting':
      router.push({ name: 'system_shop' });
      break;
    default:
      break;
  }
};

const userOptions = [
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader
  },
  {
    key: 'header-divider',
    type: 'divider'
  },
  {
    label: () => 'Profile',
    key: 'profile',
    icon: renderIcon(ProfileOutlined)
  },
  {
    label: () => 'Shop Setting',
    key: 'shop_setting',
    icon: renderIcon(SettingsOutline)
  },
  {
    label: () => 'Change Password',
    key: 'change-password',
    icon: renderIcon(UnlockOutlined)
  },
  {
    label: () => 'Logout',
    key: 'logout',
    icon: renderIcon(LogoutOutlined)
  }
];

function renderCustomHeader() {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;'
    },
    [
      h(NAvatar, {
        round: true,
        style: 'margin-right: 12px;',
        src: `${imgUrl}${userStore.currentUser.profile.profile_picture}`
      }),
      h('div', null, [
        h('div', null, [
          h(
            NText,
            { depth: 2 },
            {
              default: () =>
                `${
                  userStore.currentUser.profile.first_name +
                  ' ' +
                  userStore.currentUser.profile.last_name
                }`
            }
          )
        ]),
        h('div', null, {
          style: 'font-size: 12px;',
          default: () => `${userStore.currentUser.email}`
        })
      ])
    ]
  );
}
</script>
