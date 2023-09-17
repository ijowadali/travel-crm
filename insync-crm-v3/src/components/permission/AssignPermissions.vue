<template>
  <ContentLayout>
    <template #contentHeader>
      <NCard embedded class="mb-2 px-3 py-2" :content-style="{ padding: 0 }">
        <div class="flex flex-col items-center sm:flex-row sm:justify-between">
          <h3 class="text-lg">Permissions List</h3>
          <NButton secondary type="info" size="medium" @click="handleAssignPermissions">
            Assign Permission
          </NButton>
        </div>
      </NCard>
    </template>
    <n-tabs
      type="card"
      size="medium"
      default-value="Dashboard"
      pane-class="border-x border-b overflow-scroll h-full"
      class="sticky top-0 h-full overflow-scroll"
    >
      <n-tab-pane v-for="item of menus" :key="item.id" :name="item.menu_name" :tab="item.menu_name">
        <n-checkbox-group class="mx-2" v-model:value="selectedPermissions">
          <n-row>
            <n-col v-for="permission of item.permissions" :key="permission.id" :span="6">
              <n-checkbox :value="permission.id" :label="permission.name" />
            </n-col>
          </n-row>
        </n-checkbox-group>
      </n-tab-pane>
    </n-tabs>
  </ContentLayout>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from 'naive-ui';
import { usefilterMenu } from '@src/filters/menus';
import ContentLayout from '@src/layouts/ContentLayout/index.vue';
import { getRecordApi, updateRecordApi } from '@src/api/endpoints';

const { menus, getMenus } = usefilterMenu();
const route = useRoute();
const userData = ref({});
const message: any = useMessage();
const selectedPermissions = ref([]);
const fetchEndpoint: any = ref();
const updateEndpoint: any = ref();

onMounted(() => {
  getMenus();
  if (route.query.roleId) {
    fetchEndpoint.value = `/roles/${route.query.roleId}`;
    updateEndpoint.value = '/roles/assign-permission/' + route.query.roleId;
  } else if (route.query.userId) {
    fetchEndpoint.value = `/users/${route.query.userId}`;
    updateEndpoint.value = '/users/assign-permission/' + route.query.userId;
  }
  getRecordApi(fetchEndpoint.value).then((res: any) => {
    userData.value = res.result;
    selectedPermissions.value = res.result.permissions.map((item: any) => {
      return item.id;
    });
    message.success(res.message);
  });
});

const handleAssignPermissions = () => {
  updateRecordApi(updateEndpoint.value, {
    permissions: selectedPermissions.value
  }).then((res: any) => {
    message.success(res.message);
  });
};
</script>
<style lang="scss"></style>
