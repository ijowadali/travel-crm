<template>
  <n-card title="Shop Setting">
    <n-form ref="formRef" :label-width="80" :model="shopData" size="small">
      <n-grid x-gap="10">
        <n-form-item-gi :span="12" label="Shop Name" path="shop_name">
          <n-input v-model:value="shopData.shop_name" placeholder="Enter Shop Name" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Shop Phone" path="shop_phone">
          <n-input v-model:value="shopData.shop_phone" placeholder="Enter Shop Phone" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Shop Status" path="status">
          <n-select v-model:value="shopData.status" :options="status" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Address" path="address">
          <n-input v-model:value="shopData.address" placeholder="Enter Address" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="City" path="city">
          <n-input v-model:value="shopData.city" placeholder="Enter City" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="State" path="state">
          <n-input v-model:value="shopData.state" placeholder="Enter State" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Country" path="country">
          <n-input v-model:value="shopData.country" placeholder="Enter Country" />
        </n-form-item-gi>
        <n-form-item-gi :span="24" path="shop_logo">
          <SingleImageUploader
            :action="uploadUrl"
            :data="{ type: 0 }"
            name="shop_images"
            :width="100"
            :height="100"
            @upload-change="uploadChange"
            v-model:value="shopData.shop_logo"
          />
        </n-form-item-gi>
      </n-grid>
      <n-space justify="end">
        <n-form-item :theme-overrides="{ labelHeightSmall: '0', feedbackHeightSmall: '0' }">
          <n-button secondary type="info" @click="handleValidateClick"> Update</n-button>
        </n-form-item>
      </n-space>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
import { onMounted, ref, unref } from 'vue';
import { type FormInst, useMessage } from 'naive-ui';
import { updateRecordApi } from '@src/api/endpoints';
import { SingleImageUploader } from '@src/components/upload';
import { useUserStore } from '@src/store/modules/user';
import { useEnv } from '@src/hooks/useEnv';

const { uploadUrl } = useEnv();
const formRef = ref<FormInst | null>(null);
const shopData: any = ref({});
const userStore = useUserStore();
const message: any = useMessage();
const emits = defineEmits(['updated']);

const uploadChange = (list: string) => {
  shopData.value.shop_logo = unref(list);
};

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      updateRecordApi(`/shops/${shopData.value.id}`, shopData.value).then((res: any) => {
        message.success(res.message);
        emits('updated', res.result);
      });
    } else {
      console.log(errors);
      message.error('Invalid');
    }
  });
};

onMounted(() => {
  shopData.value = userStore.currentUser.shop;
});

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
</script>

<style lang="scss" scoped></style>
