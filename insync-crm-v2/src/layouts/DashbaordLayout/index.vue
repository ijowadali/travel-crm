<template>
  <template v-if="loading">
    <GlobalLoading />
  </template>
  <template v-else>
    <main class="h-screen w-full overflow-hidden">
      <div class="flex h-full w-full">
        <Sidebar />
        <div class="relative h-full flex-1 overflow-y-auto overflow-x-hidden">
          <Header />
          <Tabs />
          <RouterView>
            <template #default="{ Component, route }">
              <Transition name="slide-fade" mode="out-in">
                <component
                  :is="Component"
                  :key="route.fullPath"
                  class="relative min-h-[calc(100%-144px)] w-full p-2 sm:p-4"
                />
              </Transition>
            </template>
          </RouterView>
          <Footer />
        </div>
      </div>
    </main>
  </template>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue';
  import { useRouter } from 'vue-router';
  // import { AuthAPI } from '@src/api/auth';
  import GlobalLoading from '@src/components/GlobalLoading/index.vue';
  import Sidebar from '@src/layouts/components/Sidebar/index.vue';
  import Header from '@src/layouts/components/Header/index.vue';
  import Tabs from '@src/layouts/components/Tabs/index.vue';
  import Footer from '@src/layouts/components/Footer/index.vue';
  import { useUserStore } from '@src/store/modules/user';
  import { AuthUtils } from '@src/utils/auth';
  import { UserAPI } from '@src/api/user';

  const userStore = useUserStore();
  const router = useRouter();

  const loading = ref(true);

  const checkLogin = async () => {
    console.log('Token are in local storage ===>', AuthUtils.isAuthenticated());
    if (AuthUtils.isAuthenticated()) {
      if (!userStore.hasData()) {
        const { result } = (await UserAPI.getUserInfo()) || {};
        userStore.setUser(result);
      }
      loading.value = false;
      // sendSystemNotification();
    } else {
      userStore.clearUser();
      router.replace({
        path: '/login',
        // query: {
        //   redirect: route.fullPath,
        // },
      });
      loading.value = false;
    }
  };

  onBeforeMount(() => checkLogin());

  // import { useRoute } from 'vue-router';
  // import bitOceanSrc from '@src/assets/images/bit_ocean.png';
  // import { useEnv } from '@src/hooks/useEnv';
  // import { BrowserUtils } from '@src/utils/browser';
  // const { teamGitHubURL } = useEnv();
  // const { openNewWindow } = BrowserUtils;
  // const route = useRoute();
  // const notification = useNotification();
  // const sendSystemNotification = () => {
  //   setTimeout(() => {
  //     const n = notification.create({
  //       title: () => t('Notification.System.Title'),
  //       description: () => t('Notification.Team.From'),
  //       avatar: () =>
  //         h(NAvatar, {
  //           size: 'small',
  //           round: true,
  //           src: bitOceanSrc,
  //           alt: '',
  //         }),
  //       content: () => t('Notification.System.Content'),
  //       duration: 5000,
  //       keepAliveOnHover: true,
  //       meta: TimeUtils.formatTime(Date.now()),
  //       action: () =>
  //         h(
  //           NButton,
  //           {
  //             text: true,
  //             type: 'success',
  //             onClick: () => {
  //               openNewWindow(repoGitHubURL);
  //               n.destroy();
  //             },
  //           },
  //           {
  //             default: () => `${t('Common.Goto')} GitHub`,
  //           }
  //         ),
  //     });
  //   }, 800);
  // };
</script>

<style scoped lang="scss">
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }
  .slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
