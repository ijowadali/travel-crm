import { ref } from 'vue';
import { getRecordsApi } from '@src/api/endpoints';
import { isEmpty } from 'lodash';

export function filterAttribute() {
  const attributes: any = ref([]);
  const attributeLoading = ref(false);
  const attributesInitialized = ref(false);

  async function findAttribute(query: any) {
    if (isEmpty(query)) {
      attributes.value = [];
    } else {
      attributeLoading.value = true;
      const response: any = await getRecordsApi('/attributes', { name: query });
      attributes.value = response.result;
      attributeLoading.value = false;
    }
  }

  async function getAttributes() {
    attributeLoading.value = true;
    const response: any = await getRecordsApi('/attributes');
    attributes.value = response.result;
    attributeLoading.value = false;
  }

  async function getAttributesOnFocus() {
    if (!attributesInitialized.value) {
      await getAttributes();
      attributesInitialized.value = true;
    }
  }

  return {
    attributes,
    attributeLoading,
    attributesInitialized,
    findAttribute,
    getAttributes,
    getAttributesOnFocus
  };
}
