<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="small">
    <n-form-item label="Name" path="name">
      <n-input v-model:value="formValue.name" placeholder="Enter Name" />
    </n-form-item>
    <n-form-item :span="12" label="Menu Name" path="menu_id">
      <n-select
        :filterable="true"
        :tag="false"
        placeholder="Select Menu"
        v-model:value="formValue.menu_id"
        clearable
        @focus="getMenusOnFocus"
        :remote="true"
        :clear-filter-after-select="false"
        label-field="menu_name"
        value-field="id"
        :loading="menuLoading"
        :options="menus"
      />
    </n-form-item>
    <n-form-item :span="12" label="Permission Type" path="type">
      <n-select
        :filterable="true"
        :tag="false"
        placeholder="Select Permisnon Type"
        v-model:value="formValue.type"
        clearable
        :clear-filter-after-select="false"
        label-field="label"
        value-field="key"
        :options="permissionType"
      />
    </n-form-item>
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
import { usefilterMenu } from '@src/filters/menus';

const { menus, menuLoading, getMenusOnFocus } = usefilterMenu();
console.log('menus list =>', menus);
const formValue: any = ref({});
const formRef = ref<FormInst | null>(null);
const message: any = useMessage();
const emits = defineEmits(['created']);
const rules = ref({
  name: {
    required: true,
    message: 'Please Enter Name',
    trigger: 'blur'
  }
});

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      createRecordApi('/permissions', formValue.value).then((res: any) => {
        console.log(res);
        message.success(res.message);
        emits('created', res.result);
      });
    } else {
      console.log(errors);
      message.error('Please fill out required fields');
    }
  });
};

const permissionType = [
  { label: 'Public', key: 'public' },
  { label: 'Private', key: 'private' }
];
</script>

<style lang="scss" scoped></style>
