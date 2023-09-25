import { ref } from 'vue';
import { getRecordsApi } from '@src/api/endpoints';

/**
 * @description Paginated Data
 */
let timer: any = null;
export function useRoles(tag = false) {
  const rolesLoading = ref(false);
  const filteredRoles: any = ref([]);
  const filterRoles = (query = '') => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      rolesLoading.value = true;
      getRecordsApi('/roles', { name: query, pageSize: 1000 })
        .then((res: any) => {
          filteredRoles.value = res.result.data;
          if (tag && query) {
            if (!filteredRoles.value.some((role: any) => role.name === query)) {
              filteredRoles.value.unshift({ id: 0, name: query });
            }
          }
          rolesLoading.value = false;
        })
        .catch(() => {
          rolesLoading.value = false;
        });
    }, 500);
  };
  filterRoles();
  return { filterRoles, filteredRoles, rolesLoading };
}
