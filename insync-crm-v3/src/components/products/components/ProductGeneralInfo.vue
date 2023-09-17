<template>
  <n-form ref="generalInfoFormRef" :model="generalInfo" size="small" :loading="loading">
    <n-space :vertical="true" class="p-3">
      <n-row :gutter="10">
        <n-col :span="6">
          <n-form-item label="Product Title" path="title">
            <n-input v-model:value="generalInfo.title" placeholder="Enter Product Title" />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="Product Code" path="product_code">
            <n-input v-model:value="generalInfo.product_code" placeholder="Enter Product Code" />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="Status" path="status">
            <n-select v-model:value="generalInfo.status" :options="status" />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="Categories" path="category_id">
            <SingleCategorySelector
              v-model:value="generalInfo.category_id"
              label-field="name"
              value-field="id"
              :tag="false"
            />
          </n-form-item>
        </n-col>
        <n-col :span="24">
          <n-form-item label="Product Description" path="description">
            <n-input
              v-model:value="generalInfo.description"
              type="textarea"
              placeholder="Enter Product Description"
            />
          </n-form-item>
        </n-col>
        <n-col :span="24">
          <SingleImageUploader
            :action="uploadUrl"
            :data="{ type: 0 }"
            name="productImages"
            :width="200"
            :height="200"
            @upload-change="imageUploadChange"
            v-model:value="generalInfo.product_image"
          />
        </n-col>
      </n-row>
      <n-space justify="end">
        <n-form-item :theme-overrides="{ labelHeightSmall: '0', feedbackHeightSmall: '0' }">
          <n-button secondary type="info" size="medium" @click="handleValidateClick">
            Update
          </n-button>
        </n-form-item>
      </n-space>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { ref, unref } from 'vue';
import { type FormInst, useMessage } from 'naive-ui';
import { updateRecordApi } from '@src/api/endpoints';
import { SingleCategorySelector } from '@src/components/products/categories/selector';
import { SingleImageUploader } from '@src/components/upload';
import { useEnv } from '@src/hooks/useEnv';
import { useLoading } from '@src/hooks/useLoading';

const props = defineProps<{
  product: Record<string, any>;
}>();

const generalInfoFormRef = ref<FormInst | null>(null);
const generalInfo: any = ref(props.product);
const message: any = useMessage();
const [loading, loadingDispatcher] = useLoading(false);

const { uploadUrl } = useEnv();
const imageUploadChange = (list: string) => {
  generalInfo.value.product_image = unref(list);
};

console.log(generalInfo);

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  generalInfoFormRef.value?.validate((errors) => {
    if (!errors) {
      loadingDispatcher.loading();
      updateRecordApi(`/products/${generalInfo.value.id}`, generalInfo.value).then((res: any) => {
        message.success(res.message);
        loadingDispatcher.loaded();
      });
    } else {
      console.log(errors);
      message.error('Invalid');
    }
  });
};

const status = [
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Draft',
    value: 'draft'
  }
];
</script>

<style lang="scss" scope></style>
