import { ref } from 'vue';
import { getRecordsApi } from '@src/api/endpoints';

/**
 * @description Paginated Data
 */
let timer: any = null;
export function useShop(tag = false) {
  const categoriesLoading = ref(false);
  const filteredCategories: any = ref([]);
  const filterCategories = (query = '') => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      categoriesLoading.value = true;
      getRecordsApi('/shops', { name: query, pageSize: 100 })
        .then((res: any) => {
          filteredCategories.value = res.result;
          if (tag && query) {
            if (!filteredCategories.value.some((role: any) => role.name === query)) {
              filteredCategories.value.unshift({ id: 0, name: query });
            }
          }
          categoriesLoading.value = false;
        })
        .catch(() => {
          categoriesLoading.value = false;
        });
    }, 500);
  };
  filterCategories();
  return { filterCategories, filteredCategories, categoriesLoading };
}
