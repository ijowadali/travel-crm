<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" size="small">
    <n-grid x-gap="10">
      <n-form-item-gi :span="8" label="Name" path="company_name">
        <n-input v-model:value="formValue.company_name" placeholder="Enter Name" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" label="Phone" path="phone">
        <n-input v-model:value="formValue.phone" placeholder="Enter Phone" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" label="Address" path="address">
        <n-input v-model:value="formValue.address" placeholder="Enter Address" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" label="City" path="city">
        <n-input v-model:value="formValue.city" placeholder="Enter City" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" label="State" path="state">
        <n-input v-model:value="formValue.state" placeholder="Enter State" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" label="Country" path="country">
        <n-input v-model:value="formValue.country" placeholder="Enter Country" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" label="Status" path="status">
        <n-select v-model:value="formValue.status" size="small" :options="status" />
      </n-form-item-gi>
    </n-grid>
    <SingleImageUploader
      :action="uploadUrl"
      :data="{ type: 0 }"
      name="company_images"
      :width="100"
      :height="100"
      @upload-change="uploadChange"
      v-model:value="formValue.logo"
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
import { type FormInst } from 'naive-ui';
import { getRecordApi, updateRecordApi } from '@src/api/endpoints';
import { SingleImageUploader } from '@src/components/upload';
import { useEnv } from '@src/hooks/useEnv';

const { uploadUrl } = useEnv();
const formRef = ref<FormInst | null>(null);
const formValue: any = ref({});

const emits = defineEmits(['updated']);
const props = defineProps({
  id: {
    type: Number
  }
});

const uploadChange = (list: string) => {
  formValue.value.logo = unref(list);
};

// fetch single company  using id
getRecordApi(`/company/${props.id}`).then((res: any) => {
  formValue.value = res.result;
});

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      updateRecordApi(`/company/${formValue.value.id}`, formValue.value).then((res: any) => {
        window['$message'].success(res.message);
        emits('updated', res.result);
      });
    } else {
      console.log(errors);
      window['$message'].error('Invalid');
    }
  });
};
const status = ref([
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Disabled',
    value: 'disabled'
  }
]);
</script>

<style lang="scss" scoped></style>
