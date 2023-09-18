<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" size="small">
    <n-grid :span="24" :x-gap="24">
      <n-form-item-gi :span="12" label="First Name" path="first_name">
        <n-input v-model:value="formValue.profile.first_name" placeholder="Enter First Name" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="Last Name" path="last_name">
        <n-input v-model:value="formValue.profile.last_name" placeholder="Enter Last Name" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="Email" path="email">
        <n-input v-model:value="formValue.email" placeholder="Enter Email" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="Password" path="password">
        <n-input
          v-model:value="formValue.password"
          type="password"
          showPasswordOn="click"
          placeholder="Enter Password"
        />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="Status" path="status">
        <n-select v-model:value="formValue.status" size="small" :options="status" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="User Role" path="role_id">
        <n-select
          :filterable="true"
          multiple
          :tag="false"
          placeholder="Select Role"
          v-model:value="formValue.roles"
          clearable
          @focus="getRolesOnFocus"
          @update:value="checkCompanyAdminRole"
          :remote="true"
          :clear-filter-after-select="false"
          label-field="name"
          value-field="id"
          :loading="roleLoading"
          :options="roles"
        />
      </n-form-item-gi>
      <n-form-item-gi v-if="isCompanyAdmin" :span="12" label="Company Name" path="company_id">
        <n-select
          :filterable="true"
          :tag="false"
          placeholder="Select Company"
          v-model:value="formValue.company_id"
          clearable
          @focus="getCompaniesOnFocus"
          :remote="true"
          :clear-filter-after-select="false"
          label-field="company_name"
          value-field="id"
          :loading="companyLoading"
          :options="companies"
        />
      </n-form-item-gi>
    </n-grid>
    <n-space justify="end">
      <n-form-item :theme-overrides="{ labelHeightSmall: '0', feedbackHeightSmall: '0' }">
        <n-button secondary type="info" @click="handleValidateClick"> Create </n-button>
      </n-form-item>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { type FormInst } from 'naive-ui';
import { createRecordApi } from '@src/api/endpoints';
import { usefilterRole } from '@src/filters/roles';
import { usefilterCompany } from '@src/filters/company';

const { roles, roleLoading, getRolesOnFocus } = usefilterRole();
const { companies, companyLoading, getCompaniesOnFocus } = usefilterCompany();
const formRef = ref<FormInst | null>(null);
const isCompanyAdmin: any = ref(false);
const formValue: any = ref({
  profile: {},
  roles: []
});

const checkCompanyAdminRole = () => {
  const names = formValue.value.roles
    .map((val: any) => {
      const found = roles.value.find((item: any) => item.id === val);
      return found ? found.name : null;
    })
    .filter(Boolean);

  if (names.includes('company admin')) {
    isCompanyAdmin.value = true;
  } else {
    isCompanyAdmin.value = false;
  }
};

const emits = defineEmits(['created']);

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('form response', formValue.value);
      createRecordApi('/users', formValue.value).then((res: any) => {
        window['$message'].success(res.message);
        emits('created', res.result);
      });
    } else {
      console.log(errors);
      window['$message'].error('Please fill out required fields');
    }
  });
};

const status = ref([
  {
    label: 'active',
    value: 'active'
  },
  {
    label: 'disabled',
    value: 'disabled'
  }
]);
</script>

<style lang="scss" scoped></style>
