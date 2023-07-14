<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <n-card title="Profile" v-permission="{ action: ['can view profile'] }">
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
                    readonly
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Last Name" path="last_name">
                  <n-input
                    v-model:value="profileData.last_name"
                    placeholder="Enter Last Name"
                    readonly
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Phone Number" path="phone_number">
                  <n-input
                    v-model:value="profileData.phone_number"
                    placeholder="Enter Phone Number"
                    readonly
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Address" path="address">
                  <n-input
                    v-model:value="profileData.address"
                    placeholder="Enter Address"
                    readonly
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="City" path="city">
                  <n-input v-model:value="profileData.city" placeholder="Enter City" readonly />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="State" path="state">
                  <n-input v-model:value="profileData.state" placeholder="Enter State" readonly />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item label="Country" path="country">
                  <n-input
                    v-model:value="profileData.country"
                    placeholder="Enter Country"
                    readonly
                  />
                </n-form-item>
              </n-col>
            </n-row>
          </n-card>
        </n-space>
        <n-space justify="end">
          <n-form-item :theme-overrides="{ feedbackHeightSmall: '0' }">
            <n-button type="success" @click="handleValidateClick"> Edit Profile</n-button>
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
  import { useUserStore } from '@/store/modules/user';
  import EditProfile from '@/views/users/EditProfile.vue';
  import { useGlobSetting } from '@/hooks/setting';

  const profileData: any = ref({});
  const userStore = useUserStore();
  const showEditModal = ref(false);
  const globSetting = useGlobSetting();
  const { imgUrl } = globSetting;

  const handleValidateClick = (e: MouseEvent) => {
    e.preventDefault();
    showEditModal.value = true;
  };

  onMounted(() => {
    profileData.value = userStore.info.profile;
  });
</script>
<style lang="less" scoped></style>
