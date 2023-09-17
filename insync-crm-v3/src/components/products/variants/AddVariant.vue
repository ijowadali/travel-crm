<template>
  <n-card>
    <n-form ref="formRef" :label-width="80" :model="variants" :rules="rules" size="small">
      <n-grid x-gap="10">
        <n-form-item-gi :span="12" label="Attribute" path="attribute_id">
          <single-attribute-selector
            v-model:value="variants.attribute_id"
            label-field="name"
            value-field="id"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Attribute Value" path="attribute_value">
          <n-input v-model:value="variants.attribute_value" placeholder="Enter Attribute value" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="SKU ID" path="sku_id">
          <n-input v-model:value="variants.sku_id" placeholder="Enter Product SKU ID" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Stock Status" path="stock_status">
          <n-select v-model:value="variants.stock_status" :options="stock_status" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Product Price" path="price">
          <n-input-number
            class="w-full"
            v-model:value="variants.price"
            clearable
            placeholder="Enter Product Price"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Product Regular Price" path="regular_price">
          <n-input-number
            class="w-full"
            v-model:value="variants.regular_price"
            clearable
            placeholder="Enter Product Regular Price"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Stock Quantity" path="stock_quantity">
          <n-input-number
            class="w-full"
            v-model:value="variants.stock_quantity"
            clearable
            placeholder="Enter Stock Quantity"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Status" path="status">
          <n-select v-model:value="variants.status" size="small" :options="status" />
        </n-form-item-gi>
      </n-grid>
      <MultiImageUploader
        :action="uploadUrl"
        multiple
        name="productImages"
        :width="100"
        :height="100"
        @upload-change="imagesUploadChange"
        v-model:value="variants.images"
      />
      <n-space justify="end">
        <n-form-item :theme-overrides="{ labelHeightSmall: '0', feedbackHeightSmall: '0' }">
          <n-button secondary type="info" @click="handleValidateClick"> Create </n-button>
        </n-form-item>
      </n-space>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { type FormInst, useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
import { createRecordApi } from '@src/api/endpoints';
import { MultiImageUploader } from '@src/components/upload';
import { useEnv } from '@src/hooks/useEnv';

const { uploadUrl } = useEnv();

const route = useRoute();
const message: any = useMessage();
const formRef = ref<FormInst | null>(null);
const variants: any = ref({
  images: []
});

const emits = defineEmits(['created']);

const imagesUploadChange = (list: string[]) => {
  list.forEach((listImage) => {
    const existImg = variants.value.images.find((img: any) => img.images === listImage);

    if (existImg) {
      // If an image with the same URL exists, update its properties with the data from 'list'
      const index = variants.value.images.indexOf(existImg);
      variants.value.images[index] = Object.assign(existImg, {
        images: listImage
      });
    } else {
      // If the image does not exist, add it to the 'variants.value.images' array
      variants.value.images.push({
        images: listImage
      });
    }
  });
};

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      createRecordApi(`/variants/${route.params.id}`, variants.value).then((res: any) => {
        message.success(res.message);
        emits('created', res.result);
      });
    } else {
      console.log(errors);
      message.error('Please fill out required fields');
    }
  });
};

const stock_status = [
  {
    label: 'Instock',
    value: 'instock'
  },
  {
    label: 'Outofstock',
    value: 'outofstock'
  }
];

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
  sku_id: {
    required: true,
    message: 'Please Enter title',
    trigger: 'blur'
  },
  status: {
    required: true,
    message: 'Please Select Status',
    trigger: 'blur'
  }
});
</script>

<style lang="scss" scoped>
.bg_transparent {
  background-color: transparent;
}
.ql-toolbar.ql-snow {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #eee;
  margin-top: -10px;
}
.ql-container.ql-snow {
  border: none;
}
</style>
