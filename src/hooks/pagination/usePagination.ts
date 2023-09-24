import { ref, watch } from 'vue';
import { getRecordsApi } from '@src/api/endpoints';

export function usePagination(endpoint: any) {
  const list = ref([]);
  const page = ref(1);
  const searchParams = ref({});
  const emptyState = ref(false);
  const itemCount = ref(0);
  const pageSizes = ref([10, 20, 30, 40, 50, 100]);
  const pageSize = ref(20);
  const getList = () => {
    getRecordsApi(endpoint, {
      ...searchParams.value,
      page: page.value,
      pageSize: pageSize.value
    }).then((res: any) => {
      console.log('record list => ', res.result);
      list.value = res.result.data;
      itemCount.value = res.result.meta.total;
      if (res.result.meta.total === 0) {
        emptyState.value = true;
      }
    });
  };
  watch([page, pageSize], (value, oldValue) => {
    page.value = value[1] !== oldValue[1] ? 1 : page.value;
    getList();
  });
  return {
    getList,
    emptyState,
    list,
    page,
    pageSizes,
    itemCount,
    pageSize,
    searchParams
  };
}
