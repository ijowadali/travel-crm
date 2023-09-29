import { type Ref, ref } from 'vue';
import type { LoadingDispatcher } from './type';

export const useLoading = (defaultStatus = false): [Ref<boolean>, LoadingDispatcher] => {
  const loading = ref(defaultStatus);

  const dispatcher: LoadingDispatcher = {
    start: () => {
      loading.value = true;
    },
    end: () => {
      loading.value = false;
    }
  };

  return [loading, dispatcher];
};
