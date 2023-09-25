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
import GlobalLoading from '@src/components/GlobalLoading/index.vue';
import Sidebar from '@src/layouts/components/Sidebar/index.vue';
import Header from '@src/layouts/components/Header/index.vue';
import Tabs from '@src/layouts/components/Tabs/index.vue';
import Footer from '@src/layouts/components/Footer/index.vue';
import { useUserStore } from '@src/store/modules/user';
import { ACCESS_TOKEN } from '@src/utils/storage/variables';
import { storage } from '@src/utils/storage';

const userStore = useUserStore();
const router = useRouter();

const loading = ref(true);
const checkLogin = async () => {
  if (storage.isAuthenticated(ACCESS_TOKEN)) {
    if (!userStore.hasData()) {
      await userStore.getCurrentUserWithApiRequest();
      window['$message'].success('Current User Authenticated Successfully!');
    }
    loading.value = false;
  } else {
    userStore.logout();
    router.replace({
      path: '/login'
    });
    loading.value = false;
  }
  loading.value = false;
};

onBeforeMount(() => checkLogin());
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
