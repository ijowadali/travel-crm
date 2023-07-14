<template>
  <n-card title="Profile" v-permission="{ action: ['can view profile'] }">
    <n-form ref="formRef" :label-width="80" :model="profileData" size="small">
      <n-grid x-gap="10">
        <n-form-item-gi :span="12" label="First Name" path="first_name">
          <n-input v-model:value="profileData.first_name" placeholder="Enter First Name" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Last Name" path="last_name">
          <n-input v-model:value="profileData.last_name" placeholder="Enter Last Name" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Phone Number" path="phone_number">
          <n-input v-model:value="profileData.phone_number" placeholder="Enter Phone Number" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Address" path="address">
          <n-input v-model:value="profileData.address" placeholder="Enter Address" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="City" path="city">
          <n-input v-model:value="profileData.city" placeholder="Enter City" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="State" path="state">
          <n-input v-model:value="profileData.state" placeholder="Enter State" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Country" path="country">
          <n-input v-model:value="profileData.country" placeholder="Enter Country" />
        </n-form-item-gi>
        <n-form-item-gi :span="24" path="profile_picture">
          <BasicUpload
            :action="uploadUrl"
            :data="{ type: 0 }"
            name="images"
            :width="100"
            :height="100"
            @upload-change="uploadChange"
            v-model:value="profileData.profile_picture"
          />
        </n-form-item-gi>
      </n-grid>
      <n-space justify="end">
        <n-form-item :theme-overrides="{ labelHeightSmall: '0', feedbackHeightSmall: '0' }">
          <n-button type="success" @click="handleValidateClick"> Update</n-button>
        </n-form-item>
      </n-space>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { FormInst } from 'naive-ui';
  import { profileUpdateApi } from '@/api/user/user';
  import { BasicUpload } from '@/components/Upload';
  import { useUserStore } from '@/store/modules/user';
  import { useGlobSetting } from '@/hooks/setting';

  const globSetting = useGlobSetting();
  const formRef = ref<FormInst | null>(null);
  const profileData: any = ref({});
  const userStore = useUserStore();
  const emits = defineEmits(['updated']);
  const { uploadUrl } = globSetting;

  const uploadChange = (list: string) => {
    profileData.value.profile_picture = unref(list);
  };
  const handleValidateClick = (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
      if (!errors) {
        profileUpdateApi(profileData.value.id, profileData.value).then((result: any) => {
          window['$message'].success(result.message);
          emits('updated', result);
        });
      } else {
        console.log(errors);
        window['$message'].error('Invalid');
      }
    });
  };

  onMounted(() => {
    profileData.value = userStore.info.profile;
  });
</script>
<style lang="less" scoped></style>
