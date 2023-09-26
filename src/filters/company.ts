import { ref } from 'vue';
import { getRecordsApi } from '@src/api/endpoints';
import { isEmpty } from 'lodash';

export function usefilterCompany() {
  const companies: any = ref([]);
  const companyLoading = ref(false);
  const companysInitialized = ref(false);

  async function findCompany(query: any) {
    if (isEmpty(query)) {
      companies.value = [];
    } else {
      companyLoading.value = true;
      const response: any = await getRecordsApi('/company', { name: query });
      companies.value = response.result;
      companyLoading.value = false;
    }
  }

  async function getCompanies() {
    companyLoading.value = true;
    const response: any = await getRecordsApi('/company');
    console.log('companies ==>', response);
    companies.value = response.result;
    companyLoading.value = false;
  }

  async function getCompaniesOnFocus() {
    if (!companysInitialized.value) {
      await getCompanies();
      companysInitialized.value = true;
    }
  }

  return {
    companies,
    companyLoading,
    companysInitialized,
    findCompany,
    getCompanies,
    getCompaniesOnFocus
  };
}
