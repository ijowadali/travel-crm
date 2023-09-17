<template>
  <n-form ref="menuFormRef" :label-width="80" :model="menusData" :rules="rules" size="small">
    <n-form-item label="Menu Name" path="menu_name">
      <n-input v-model:value="menusData.menu_name" placeholder="Enter Menu Name" />
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

const menuFormRef = ref<FormInst | null>(null);
const menusData: any = ref({});
const message: any = useMessage();

const emits = defineEmits(['created']);

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  menuFormRef.value?.validate((errors) => {
    if (!errors) {
      console.log(menusData.value);
      createRecordApi('/menus', menusData.value).then((res: any) => {
        message.success(res.message);
        emits('created', res.result);
      });
    } else {
      console.log(errors);
      message.error('Please fill out required fields');
    }
  });
};

const rules = ref({
  shop_name: {
    required: true,
    message: 'Please Enter Name',
    trigger: 'blur'
  }
});
</script>

<style lang="scss" scoped></style>
