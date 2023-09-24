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
import { type FormInst } from 'naive-ui';
import { getRecordApi, updateRecordApi } from '@src/api/endpoints';

const menuFormRef = ref<FormInst | null>(null);
const menusData: any = ref({});

const emits = defineEmits(['updated']);
const props = defineProps({
  id: {
    type: Number
  }
});

// fetch single Shop  using id
getRecordApi(`/menus/${props.id}`).then((res: any) => {
  menusData.value = res.result;
});

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  menuFormRef.value?.validate((errors) => {
    if (!errors) {
      updateRecordApi(`/menus/${menusData.value.id}`, menusData.value).then((res: any) => {
        window['$message'].success(res.message);
        emits('updated', res.result);
      });
    } else {
      console.log(errors);
      window['$message'].error('Invalid');
    }
  });
};

const rules = ref({
  menu_name: {
    required: true,
    message: 'Please Enter Menu Name',
    trigger: 'blur'
  }
});
</script>

<style lang="scss" scoped></style>
