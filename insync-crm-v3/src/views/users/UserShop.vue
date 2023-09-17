<template>
  <n-card title="Shop Setting">
    <n-row>
      <n-col :span="8" class="text-center">
        <n-avatar round :size="200" :src="`${imgUrl}${shopData.shop_logo}`" />
      </n-col>
      <n-col :span="16">
        <n-space style="display: block" vertical>
          <n-card title="Shop Details">
            <n-row gutter="12">
              <n-col :span="8">
                <n-form-item label="Shop Name" path="shop_name">
                  <n-input
                    v-model:value="shopData.shop_name"
                    placeholder="Enter Shop Name"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Shop Phone" path="shop_phone">
                  <n-input
                    v-model:value="shopData.shop_phone"
                    placeholder="Enter Shop Phone"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Status" path="status">
                  <n-select
                    v-model:value="shopData.status"
                    size="small"
                    :options="status"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Address" path="address">
                  <n-input v-model:value="shopData.address" placeholder="Enter Address" disabled />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="City" path="city">
                  <n-input v-model:value="shopData.city" placeholder="Enter City" disabled />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="State" path="state">
                  <n-input v-model:value="shopData.state" placeholder="Enter State" disabled />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Country" path="country">
                  <n-input v-model:value="shopData.country" placeholder="Enter Country" disabled />
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
            <n-button secondary type="info" @click="handleValidateClick"> Edit Shop</n-button>
          </n-form-item>
        </n-space>
      </n-col>
    </n-row>

    <n-modal style="width: 70%" v-model:show="showEditModal" preset="dialog">
      <template #header>
        <div>Edit Shop</div>
      </template>
      <n-space :vertical="true">
        <edit-shop @updated="showEditModal = false" />
      </n-space>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@src/store/modules/user';
import { useEnv } from '@src/hooks/useEnv';
import EditShop from '@src/views/users/EditShop.vue';

const { imgUrl } = useEnv();
const userStore = useUserStore();
const showEditModal = ref(false);
const shopData: any = ref({});

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  showEditModal.value = true;
};

// console.log(shopData);

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
