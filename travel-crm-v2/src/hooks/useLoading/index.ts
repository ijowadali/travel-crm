import { Ref, ref } from 'vue';
import type { LoadingDispatcher } from './type';

export const useLoading = (
  defaultStatus: boolean = false
): [Ref<boolean>, LoadingDispatcher] => {
  const loading = ref(defaultStatus);

  const dispatcher: LoadingDispatcher = {
    loading: () => {
      loading.value = true;
    },
    loaded: () => {
      loading.value = false;
    },
  };

  return [loading, dispatcher];
};
