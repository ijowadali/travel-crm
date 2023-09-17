<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="small">
    <n-form-item style="padding-top: 24px" label="Name" path="name">
      <n-input v-model:value="formValue.name" placeholder="Enter Name" />
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

const formValue: any = ref({});
const formRef = ref<FormInst | null>(null);
const emits = defineEmits(['created']);
const message: any = useMessage();

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
      createRecordApi('/roles', formValue.value).then((res: any) => {
        message(res.message);
        emits('created', res.result);
      });
    } else {
      console.log(errors);
      message.error('Please fill out required fields');
    }
  });
};
</script>

<style lang="scss" scoped></style>
