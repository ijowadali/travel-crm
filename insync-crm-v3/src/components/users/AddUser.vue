<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="small">
    <n-grid :span="24" :x-gap="24">
      <n-form-item-gi :span="12" label="First Name" path="first_name">
        <n-input v-model:value="formValue.first_name" placeholder="Enter First Name" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="Last Name" path="last_name">
        <n-input v-model:value="formValue.last_name" placeholder="Enter Last Name" />
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
          v-model:value="formValue.role_id"
          clearable
          @focus="getRolesOnFocus"
          @update:value="checkVendorRole"
          :remote="true"
          :clear-filter-after-select="false"
          label-field="name"
          value-field="id"
          :loading="roleLoading"
          :options="roles"
        />
      </n-form-item-gi>
      <n-form-item-gi v-if="isVendor" :span="12" label="Shop Name" path="shop_id">
        <n-select
          :filterable="true"
          :tag="false"
          placeholder="Select Shop"
          v-model:value="formValue.shop_id"
          clearable
          @focus="getShopsOnFocus"
          :remote="true"
          :clear-filter-after-select="false"
          label-field="shop_name"
          value-field="id"
          :loading="shopLoading"
          :options="shops"
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
import { type FormInst, useMessage } from 'naive-ui';
import { createRecordApi } from '@src/api/endpoints';
import { usefilterRole } from '@src/filters/roles';
import { usefilterShop } from '@src/filters/shops';

const { roles, roleLoading, getRolesOnFocus } = usefilterRole();
const { shops, shopLoading, getShopsOnFocus } = usefilterShop();
const formRef = ref<FormInst | null>(null);
const formValue: any = ref({});
const message: any = useMessage();
const isVendor: any = ref(false);

const checkVendorRole = () => {
  const names = formValue.value.role_id
    .map((val: any) => {
      const found = roles.value.find((item: any) => item.id === val);
      return found ? found.name : null;
    })
    .filter(Boolean);

  if (names.includes('vendor')) {
    isVendor.value = true;
  } else {
    isVendor.value = false;
  }
};

const emits = defineEmits(['created']);

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      createRecordApi('/users', formValue.value).then((res: any) => {
        message.success(res.message);
        emits('created', res.result);
      });
    } else {
      console.log(errors);
      message.error('Please fill out required fields');
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

const rules = ref({
  first_name: {
    required: true,
    message: 'Please Enter First Name',
    trigger: 'blur'
  },
  last_name: {
    required: true,
    message: 'Please Enter last Name',
    trigger: 'blur'
  },
  email: {
    required: true,
    message: 'Please Enter email',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: 'Please Enter Password',
    trigger: 'blur'
  }
});
</script>

<style lang="scss" scoped></style>
