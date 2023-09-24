<template>
  <n-card title="Profile">
    <n-row>
      <n-col :span="8" class="text-center">
        <n-avatar round :size="200" :src="`${imgUrl}${profileData.profile_picture}`" />
      </n-col>
      <n-col :span="16">
        <n-space style="display: block" vertical>
          <n-card title="Profile Details">
            <n-row gutter="12">
              <n-col :span="8">
                <n-form-item label="First Name" path="first_name">
                  <n-input
                    v-model:value="profileData.first_name"
                    placeholder="Enter First Name"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Last Name" path="last_name">
                  <n-input
                    v-model:value="profileData.last_name"
                    placeholder="Enter Last Name"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Phone Number" path="phone_number">
                  <n-input
                    v-model:value="profileData.phone_number"
                    placeholder="Enter Phone Number"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Address" path="address">
                  <n-input
                    v-model:value="profileData.address"
                    placeholder="Enter Address"
                    disabled
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="City" path="city">
                  <n-input v-model:value="profileData.city" placeholder="Enter City" disabled />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="State" path="state">
                  <n-input v-model:value="profileData.state" placeholder="Enter State" disabled />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Country" path="country">
                  <n-input
                    v-model:value="profileData.country"
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
            <n-button secondary type="info" @click="handleValidateClick"> Edit Profile</n-button>
          </n-form-item>
        </n-space>
      </n-col>
    </n-row>

    <n-modal style="width: 70%" v-model:show="showEditModal" preset="dialog">
      <template #header>
        <div>Edit Profile</div>
      </template>
      <n-space :vertical="true">
        <edit-profile @updated="showEditModal = false" />
      </n-space>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@src/store/modules/user';
import { useEnv } from '@src/hooks/useEnv';
import EditProfile from '@src/views/users/EditProfile.vue';

const { imgUrl } = useEnv();
const userStore = useUserStore();
const showEditModal = ref(false);
const profileData: any = ref({});

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  showEditModal.value = true;
};

// console.log(profileData);

onMounted(() => {
  profileData.value = userStore.currentUser.profile;
});
</script>

<style lang="scss" scoped></style>
