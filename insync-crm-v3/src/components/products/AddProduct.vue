<template>
  <ContentLayout>
    <div class="overflow-scroll">
      <n-form ref="formRef" :label-width="80" :model="product" :rules="rules">
        <n-row :gutter="10">
          <n-col :span="18">
            <n-space :vertical="true">
              <n-card title="Title">
                <n-form-item label="Product Title" path="title">
                  <n-input v-model:value="product.title" placeholder="Enter Product Title" />
                </n-form-item>
              </n-card>
              <n-card title="Description">
                <!-- <QuillEditor
                ref="quillEditor"
                :options="options"
                v-model:content="product.description"
                style="height: 350px"
                class="quillEditor"
              /> -->
                <n-form-item label="Product Description" path="description">
                  <n-input
                    v-model:value="product.description"
                    type="textarea"
                    placeholder="Enter Product Description"
                  />
                </n-form-item>
              </n-card>
              <n-card title="Inventory">
                <n-row :gutter="10">
                  <n-col :span="12">
                    <n-form-item label="Product SKU ID" path="product_code">
                      <n-input
                        v-model:value="product.product_code"
                        placeholder="Enter Product Code"
                      />
                    </n-form-item>
                  </n-col>
                  <n-col :span="24">
                    <SingleImageUploader
                      :action="uploadUrl"
                      :data="{ type: 0 }"
                      name="products"
                      :width="100"
                      :height="100"
                      @upload-change="uploadChange"
                      v-model:value="product.product_image"
                    />
                  </n-col>
                </n-row>
              </n-card>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space :vertical="true">
              <n-card title="Publish">
                <n-form-item label="Status" path="status">
                  <n-select v-model:value="product.status" :options="status" />
                </n-form-item>
                <n-button secondary type="info" @click="handleValidateClick" class="float-right">
                  Create
                </n-button>
              </n-card>
              <n-card title="Product Categories">
                <n-form-item label="Categories" path="category_id">
                  <!-- <single-category-selector
                    v-model:value="product.category_id"
                    label-field="name"
                    value-field="id"
                    :tag="false"
                  /> -->
                  <n-select
                    :filterable="true"
                    :tag="false"
                    placeholder="Select Category"
                    v-model:value="product.category_id"
                    clearable
                    @focus="getCategoriesOnFocus"
                    :remote="true"
                    :clear-filter-after-select="false"
                    label-field="name"
                    value-field="id"
                    :loading="categoryLoading"
                    :options="categories"
                  />
                </n-form-item>
              </n-card>
            </n-space>
          </n-col>
        </n-row>
      </n-form>
    </div>
  </ContentLayout>
</template>

<script lang="ts" setup>
import ContentLayout from '@src/layouts/ContentLayout/index.vue';
import { ref, unref } from 'vue';
import { type FormInst, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
// import '@vueup/vue-quill/dist/vue-quill.snow.css';
// import { QuillEditor } from '@vueup/vue-quill';
import { createRecordApi } from '@src/api/endpoints';
import { SingleImageUploader } from '@src/components/upload';
import { useEnv } from '@src/hooks/useEnv';
import { usefilterCategory } from '@src/filters/categories';

const { uploadUrl } = useEnv();
const { categories, categoryLoading, getCategoriesOnFocus } = usefilterCategory();
// const quillEditor = ref();
const formRef = ref<FormInst | null>(null);
const product: any = ref({});
const message: any = useMessage();

const loading = ref(false);
const router = useRouter();

const emits = defineEmits(['created']);

const uploadChange = (list: string) => {
  product.value = unref(list);
};

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true;
      createRecordApi(`/products`, product.value).then((res: any) => {
        message.success(res.message);
        emits('created', res.result);
        loading.value = false;
        router.replace('/product');
      });
    } else {
      console.log(errors);
      message.error('Please fill out required fields');
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

// const options = reactive({
//   modules: {
//     toolbar: [
//       ['bold', 'italic', 'underline', 'strike'], // toggled buttons
//       ['blockquote', 'code-block'],
//       [{ header: 1 }, { header: 2 }], // custom button values
//       [{ list: 'ordered' }, { list: 'bullet' }],
//       [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
//       [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
//       [{ direction: 'rtl' }], // text direction
//       [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
//       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//       [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//       [{ font: [] }],
//       [{ align: [] }],
//       ['clean'],
//       ['image'],
//     ],
//   },
//   theme: 'snow',
//   placeholder: 'Enter what you like!',
// });
const rules = ref({
  title: {
    required: true,
    message: 'Please Enter title',
    trigger: 'blur'
  },
  status: {
    required: true,
    message: 'Please Select Status',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: 'Please Enter description',
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
