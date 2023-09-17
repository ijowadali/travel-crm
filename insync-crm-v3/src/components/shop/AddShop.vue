<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="small">
    <n-grid x-gap="10">
      <n-form-item-gi :span="8" class="pt-6" label="Name" path="shop_name">
        <n-input v-model:value="formValue.shop_name" placeholder="Enter Name" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" class="pt-6" label="Phone" path="shop_phone">
        <n-input v-model:value="formValue.shop_phone" placeholder="Enter Phone" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" class="pt-6" label="Address" path="address">
        <n-input v-model:value="formValue.address" placeholder="Enter Address" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" label="City" path="city">
        <n-input v-model:value="formValue.city" placeholder="Enter City" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" style="padding-top: 4px" label="State" path="state">
        <n-input v-model:value="formValue.state" placeholder="Enter State" />
      </n-form-item-gi>
      <n-form-item-gi :span="8" style="padding-top: 4px" label="Country" path="country">
        <n-input v-model:value="formValue.country" placeholder="Enter Country" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="Status" path="status">
        <n-select v-model:value="formValue.status" size="small" :options="status" />
      </n-form-item-gi>
    </n-grid>
    <SingleImageUploader
      :action="uploadUrl"
      :data="{ type: 0 }"
      name="shop_images"
      :width="100"
      :height="100"
      @upload-change="uploadChange"
      v-model:value="formValue.shop_logo"
    />
    <n-space justify="end">
      <n-form-item :theme-overrides="{ labelHeightSmall: '0', feedbackHeightSmall: '0' }">
        <n-button secondary type="info" @click="handleValidateClick"> Create </n-button>
      </n-form-item>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { ref, unref } from 'vue';
import { type FormInst, useMessage } from 'naive-ui';
import { createRecordApi } from '@src/api/endpoints';
import { SingleImageUploader } from '@src/components/upload';
import { useEnv } from '@src/hooks/useEnv';

const { uploadUrl } = useEnv();
const formValue: any = ref({});
const formRef = ref<FormInst | null>(null);
const message: any = useMessage();

const emits = defineEmits(['created']);

const uploadChange = (list: string) => {
  formValue.value.shop_logo = unref(list);
};

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log(formValue.value);
      createRecordApi('/shops', formValue.value).then((res: any) => {
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
  shop_name: {
    required: true,
    message: 'Please Enter Name',
    trigger: 'blur'
  },
  shop_phone: {
    required: true,
    message: 'Please Enter Phone',
    trigger: 'blur'
  },
  address: {
    required: true,
    message: 'Please Enter Address',
    trigger: 'blur'
  },
  city: {
    required: true,
    message: 'Please Enter City',
    trigger: 'blur'
  },
  state: {
    required: true,
    message: 'Please Enter State',
    trigger: 'blur'
  },
  country: {
    required: true,
    message: 'Please Enter Country',
    trigger: 'blur'
  },
  shop_logo: {
    required: true,
    message: 'Please Upload Logo',
    trigger: 'blur'
  }
});
</script>

<style lang="scss" scoped></style>
