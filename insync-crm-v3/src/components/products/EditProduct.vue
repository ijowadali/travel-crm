<template>
  <ContentLayout>
    <template #contentHeader>
      <NCard embedded class="mb-2 px-3 py-2" :content-style="{ padding: 0 }">
        <div class="flex flex-col items-center sm:flex-row sm:justify-between">
          <h3 class="text-lg">Edit Product</h3>
          <NButton
            secondary
            type="info"
            size="medium"
            @click="router.push({ name: 'product_list' })"
          >
            Back to Product
          </NButton>
        </div>
      </NCard>
    </template>
    <n-tabs
      type="card"
      size="medium"
      v-model:currentValue="currentTab"
      @update:value="handleTabChange"
      pane-class="border-x border-b overflow-scroll h-full"
      class="sticky top-0 h-full overflow-scroll"
    >
      <n-tab-pane name="general" tab="General">
        <ProductGeneralInfo v-if="productDataLoaded" :product="product" />
      </n-tab-pane>
      <n-tab-pane name="variants" tab="Variants">
        <ProductVariants v-if="variantDataLoaded" :variants="variants" />
      </n-tab-pane>
    </n-tabs>
  </ContentLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { getRecordApi } from '@src/api/endpoints';
import ContentLayout from '@src/layouts/ContentLayout/index.vue';
import ProductGeneralInfo from '@src/components/products/components/ProductGeneralInfo.vue';
import ProductVariants from '@src/components/products/components/ProductVariants.vue';

const route = useRoute();
const router = useRouter();
const product: any = ref({});
const productDataLoaded = ref(false);
const message: any = useMessage();
const currentTab = ref('general');
const variants: any = ref({
  images: []
});
const variantDataLoaded = ref(false);

getRecordApi(`/products/${route.params.id}`).then((res: any) => {
  product.value = res.result;
  productDataLoaded.value = true;
});

const handleTabChange = (value: string) => {
  if (value === 'variants') {
    getRecordApi(`/variants/getVariantsByProduct/${route.params.id}`).then((res: any) => {
      variants.value = res.result;
      variantDataLoaded.value = true;
      message.success(res.message);
    });
  }
};
</script>

<style lang="scss" scoped></style>
