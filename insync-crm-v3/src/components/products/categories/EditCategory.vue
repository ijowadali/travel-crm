<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="small">
    <n-form-item style="padding-top: 24px" label="Name" path="name">
      <n-input v-model:value="formValue.name" placeholder="Edit Name" />
    </n-form-item>
    <SingleImageUploader
      :action="uploadUrl"
      :data="{ type: 0 }"
      name="categoriesImages"
      :width="100"
      :height="100"
      @upload-change="uploadChange"
      v-model:value="formValue.image"
    />
    <n-space justify="end">
      <n-form-item :theme-overrides="{ labelHeightSmall: '0', feedbackHeightSmall: '0' }">
        <n-button secondary type="info" @click="handleValidateClick"> Update </n-button>
      </n-form-item>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { ref, unref } from 'vue';
import { type FormInst, useMessage } from 'naive-ui';
import { updateRecordApi, getRecordApi } from '@src/api/endpoints';
import { SingleImageUploader } from '@src/components/upload';
import { useEnv } from '@src/hooks/useEnv';

const { uploadUrl } = useEnv();
const formValue: any = ref({});
const formRef = ref<FormInst | null>(null);
const message: any = useMessage();
const emits = defineEmits(['updated']);

const uploadChange = (list: string) => {
  formValue.value.image = unref(list);
};

const props = defineProps({
  id: {
    type: Number
  }
});
// get category for update
getRecordApi(`/categories/${props.id}`).then((res: any) => (formValue.value = res.result));

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
      console.log(formValue.value);
      updateRecordApi(`/categories/${formValue.value.id}`, formValue.value).then((res: any) => {
        message.success(res.message);
        emits('updated', res.result);
      });
    } else {
      console.log(errors);
      message.error('Invalid');
    }
  });
};
</script>

<style lang="scss" scoped></style>
