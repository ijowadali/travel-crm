import { ref } from 'vue';
import { getRecordsApi } from '@src/api/endpoints';
import { isEmpty } from 'lodash';

export function usefilterShop() {
  const shops: any = ref([]);
  const shopLoading = ref(false);
  const shopsInitialized = ref(false);

  async function findShop(query: any) {
    if (isEmpty(query)) {
      shops.value = [];
    } else {
      shopLoading.value = true;
      const response: any = await getRecordsApi('/shops', { name: query });
      shops.value = response.result;
      shopLoading.value = false;
    }
  }

  async function getShops() {
    shopLoading.value = true;
    const response: any = await getRecordsApi('/shops');
    shops.value = response.result;
    shopLoading.value = false;
  }

  async function getShopsOnFocus() {
    if (!shopsInitialized.value) {
      await getShops();
      shopsInitialized.value = true;
    }
  }

  return {
    shops,
    shopLoading,
    shopsInitialized,
    findShop,
    getShops,
    getShopsOnFocus
  };
}
