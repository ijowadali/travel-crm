<template>
  <n-card title="Company Setting">
    <n-row>
      <n-col :span="8" class="text-center">
        <n-avatar round :size="200" :src="`${imgUrl}${companyData?.logo}`" />
      </n-col>
      <n-col :span="16">
        <n-space style="display: block" vertical>
          <n-card title="Company Details">
            <n-row gutter="12">
              <n-col :span="8">
                <n-form-item label="Name" path="comapny_name">
                  <n-input
                    v-model:value="companyData.company_name"
                    placeholder="Enter Name"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Phone" path="phone">
                  <n-input v-model:value="companyData.phone" placeholder="Enter Phone" disabled />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Status" path="status">
                  <n-select
                    v-model:value="companyData.status"
                    size="small"
                    :options="status"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Address" path="address">
                  <n-input
                    v-model:value="companyData.address"
                    placeholder="Enter Address"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="City" path="city">
                  <n-input v-model:value="companyData.city" placeholder="Enter City" disabled />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="State" path="state">
                  <n-input v-model:value="companyData.state" placeholder="Enter State" disabled />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Country" path="country">
                  <n-input
                    v-model:value="companyData.country"
                    placeholder="Enter Country"
                    disabled
                  />
                </n-form-item>
              </n-col>
            </n-row>
          </n-card>
        </n-space>
        <n-space justify="end">
          <n-form-item
            :theme-overrides="{
              labelHeightSmall: '0',
              feedbackHeightSmall: '0'
            }"
          >
            <n-button secondary type="info" @click="handleValidateClick"> Edit Company</n-button>
          </n-form-item>
        </n-space>
      </n-col>
    </n-row>

    <n-modal style="width: 70%" v-model:show="showEditModal" preset="dialog">
      <template #header>
        <div>Edit Company</div>
      </template>
      <n-space :vertical="true">
        <edit-company @updated="showEditModal = false" />
      </n-space>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@src/store/modules/user';
import { useEnv } from '@src/hooks/useEnv';
import EditCompany from '@src/views/users/EditCompany.vue';

const { imgUrl } = useEnv();
const userStore = useUserStore();
const showEditModal = ref(false);
const companyData: any = ref({});

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  showEditModal.value = true;
};

// console.log(company);

onMounted(() => {
  companyData.value = userStore.currentUser.company;
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
