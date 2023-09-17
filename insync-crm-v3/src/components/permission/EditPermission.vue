<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="small">
    <n-form-item style="padding-top: 24px" label="Name" path="name">
      <n-input v-model:value="formValue.name" placeholder="Edit Name" />
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
        <n-button secondary type="info" @click="handleValidateClick"> Update </n-button>
      </n-form-item>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { type FormInst, useMessage } from 'naive-ui';
import { getRecordApi, updateRecordApi } from '@src/api/endpoints';
import { usefilterMenu } from '@src/filters/menus';

const { menus, menuLoading, getMenus, getMenusOnFocus } = usefilterMenu();
const formValue: any = ref({});
const formRef = ref<FormInst | null>(null);
const message: any = useMessage();
const emits = defineEmits(['updated']);
const props = defineProps({
  id: {
    type: Number
  }
});
// get permission for update
getRecordApi(`/permissions/${props.id}`).then((res: any) => {
  formValue.value = res.result;
  getMenus();
});

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
      updateRecordApi(`/permissions/${formValue.value.id}`, formValue.value).then((res: any) => {
        message.success(res.message);
        emits('updated', res.result);
      });
    } else {
      console.log(errors);
      message.error('Invalid');
    }
  });
};

const permissionType = [
  { label: 'Public', key: 'public' },
  { label: 'Private', key: 'private' }
];
</script>

<style lang="scss" scoped></style>
