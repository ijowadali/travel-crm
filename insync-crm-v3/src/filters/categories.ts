import { ref } from 'vue';
import { getRecordsApi } from '@src/api/endpoints';
import { isEmpty } from 'lodash';

export function usefilterCategory() {
  const categories: any = ref([]);
  const categoryLoading = ref(false);
  const categoriesInitialized = ref(false);

  async function findCategory(query: any) {
    if (isEmpty(query)) {
      categories.value = [];
    } else {
      categoryLoading.value = true;
      const response: any = await getRecordsApi('/categories', { name: query });
      categories.value = response.result;
      categoryLoading.value = false;
    }
  }

  async function getCategories() {
    categoryLoading.value = true;
    const response: any = await getRecordsApi('/categories');
    categories.value = response.result;
    categoryLoading.value = false;
  }

  async function getCategoriesOnFocus() {
    if (!categoriesInitialized.value) {
      await getCategories();
      categoriesInitialized.value = true;
    }
  }

  return {
    categories,
    categoryLoading,
    categoriesInitialized,
    findCategory,
    getCategories,
    getCategoriesOnFocus
  };
}
