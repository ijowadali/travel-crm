<template>
  <n-card title="Comapny Setting" v-if="isSuperAdminUser()">
    <n-form ref="formRef" :label-width="80" :model="companyData" size="small">
      <n-grid x-gap="10">
        <n-form-item-gi :span="12" label="Shop Name" path="company_name">
          <n-input v-model:value="companyData.company_name" placeholder="Enter Name" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Company Phone" path="hone">
          <n-input v-model:value="companyData.phone" placeholder="Enter Phone" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Status" path="status">
          <n-select v-model:value="companyData.status" :options="status" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Address" path="address">
          <n-input v-model:value="companyData.address" placeholder="Enter Address" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="City" path="city">
          <n-input v-model:value="companyData.city" placeholder="Enter City" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="State" path="state">
          <n-input v-model:value="companyData.state" placeholder="Enter State" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Country" path="country">
          <n-input v-model:value="companyData.country" placeholder="Enter Country" />
        </n-form-item-gi>
        <n-form-item-gi :span="24" path="logo">
          <SingleImageUploader
            :action="uploadUrl"
            :data="{ type: 0 }"
            name="company_images"
            :width="100"
            :height="100"
            @upload-change="uploadChange"
            v-model:value="companyData.logo"
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
import { type FormInst } from 'naive-ui';
import { updateRecordApi } from '@src/api/endpoints';
import { SingleImageUploader } from '@src/components/upload';
import { useUserStore } from '@src/store/modules/user';
import { isSuperAdminUser } from '@src/checks/adminChecks';
import { useEnv } from '@src/hooks/useEnv';

const { uploadUrl } = useEnv();
const formRef = ref<FormInst | null>(null);
const companyData: any = ref({});
const userStore = useUserStore();
const emits = defineEmits(['updated']);

const uploadChange = (list: string) => {
  companyData.value.shop_logo = unref(list);
};

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      updateRecordApi(`/shops/${companyData.value.id}`, companyData.value).then((res: any) => {
        window['$message'].success(res.message);
        emits('updated', res.result);
      });
    } else {
      console.log(errors);
      window['$message'].error('Invalid');
    }
  });
};

onMounted(() => {
  companyData.value = userStore.currentUser.shop;
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
