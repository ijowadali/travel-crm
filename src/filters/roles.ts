import { ref } from 'vue';
import { getRecordsApi } from '@src/api/endpoints';
import { isEmpty } from 'lodash';

export function usefilterRole() {
  const roles: any = ref([]);
  const roleLoading = ref(false);
  const rolesInitialized = ref(false);

  async function getRoleByParams(query: any) {
    if (isEmpty(query)) {
      roles.value = [];
    } else {
      roleLoading.value = true;
      const response: any = await getRecordsApi('/roles', {
        name: query
      });
      roles.value = response.result;
      roleLoading.value = false;
    }
  }

  async function findRole(query: any) {
    if (query !== '') {
      roleLoading.value = true;
      const response: any = await getRecordsApi('/roles', { name: query });
      roles.value = response.result;
      roleLoading.value = false;
    } else {
      roles.value = [];
    }
  }

  async function getRoles() {
    roleLoading.value = true;
    const response: any = await getRecordsApi('/roles');
    roles.value = response.result;
    roleLoading.value = false;
  }

  async function getRolesOnFocus() {
    if (!rolesInitialized.value) {
      await getRoles();
      rolesInitialized.value = true;
    }
  }

  return {
    roles,
    roleLoading,
    rolesInitialized,
    getRoleByParams,
    findRole,
    getRoles,
    getRolesOnFocus
  };
}
