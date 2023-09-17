<template>
  <DataTableLayout :loading="loading">
    <template #tableHeader>
      <div class="flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <div class="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
          <div class="flex w-full items-center !space-x-2 sm:w-fit">
            <NInput
              v-model:value="searchParams.name"
              class="sm:!w-[200px]"
              clearable
              placeholder="Search by Email"
              @keyup="fetchList"
            >
              <template #prefix>
                <NIcon :component="SearchOutlined" class="mr-1" />
              </template>
            </NInput>
          </div>
        </div>
        <div class="flex w-full items-center justify-between space-x-3 sm:justify-end">
          <NButton
            secondary
            type="info"
            :size="isMobile ? 'small' : 'medium'"
            @click="showModal = true"
            v-permission="{ action: ['can view user create'] }"
          >
            Create
          </NButton>
        </div>
      </div>
    </template>

    <template #tableContent>
      <table class="table" v-permission="{ action: ['can view users'] }">
        <thead class="head">
          <tr>
            <th class="sticky_el left-0 z-20">ID</th>
            <th class="th">Name</th>
            <th class="th">Picture</th>
            <th class="th">Email</th>
            <th class="th">Role</th>
            <th class="th">Phone#</th>
            <th class="th">Shop</th>
            <th class="th">Shop Phone#</th>
            <th class="th">Status</th>
            <th class="th">Address</th>
            <th class="th">Created At</th>
            <th class="th">Updated At</th>
            <th
              class="sticky_el right-0 z-20"
              v-permission="{
                action: ['can view user update', 'can view user delete']
              }"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0">
            <td colspan="15" class="data_placeholder">Record Not Exist</td>
          </tr>
          <tr v-else v-for="item in list" :key="item.id" class="body_tr">
            <td class="sticky_el left-0 z-10">{{ item?.id }}</td>
            <td class="td">
              {{ item?.profile?.first_name + ' ' + item?.profile?.last_name }}
            </td>
            <td class="td pt-2">
              <n-avatar :size="50" :src="`${imgUrl}${item?.profile.profile_picture}`" />
            </td>
            <td class="td">{{ item?.email }}</td>
            <td class="td">
              <n-space>
                <n-tag v-for="role in item.roles" :key="role.id" type="success" :bordered="false">
                  {{ role?.name }}
                </n-tag>
              </n-space>
            </td>
            <td class="td">{{ item?.profile?.phone_number }}</td>
            <td class="td">{{ item?.shop?.shop_name }}</td>
            <td class="td">{{ item?.shop?.shop_phone }}</td>
            <td class="td">
              <n-tag :bordered="false" type="info">
                {{ item.status }}
              </n-tag>
            </td>
            <td class="td">
              {{
                item?.profile?.address +
                ' ' +
                item?.profile?.city +
                ' ' +
                item?.profile?.state +
                ' ' +
                item?.profile?.country
              }}
            </td>
            <td class="td">{{ item.created_at }}</td>
            <td class="td">{{ item.updated_at }}</td>
            <td
              class="sticky_el right-0 z-10"
              v-permission="{
                action: ['can view user update', 'can view user delete']
              }"
            >
              <n-dropdown
                @click="actionOperation(item)"
                :onSelect="selectedAction"
                trigger="click"
                :options="filteredOptions"
              >
                <n-button size="small" :circle="true">
                  <n-icon>
                    <more-outlined />
                  </n-icon>
                </n-button>
              </n-dropdown>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <template #tableFooter>
      <div class="flex flex-col items-center space-y-2 sm:flex-row sm:justify-end sm:space-y-0">
        <n-pagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :item-count="itemCount"
          :page-sizes="pageSizes"
          size="small"
          :show-quick-jumper="true"
          :show-size-picker="true"
        />
      </div>
    </template>

    <n-modal style="width: 70%" v-model:show="showModal" preset="dialog">
      <template #header>
        <div>Create New User</div>
      </template>
      <n-space :vertical="true">
        <add-user
          @created="
            getList();
            showModal = false;
          "
        />
      </n-space>
    </n-modal>

    <n-modal style="width: 70%" v-model:show="showEditModal" preset="dialog">
      <template #header>
        <div>Update User</div>
      </template>
      <n-space :vertical="true">
        <edit-user
          :id="selectedId"
          @updated="
            getList();
            showEditModal = false;
          "
        />
      </n-space>
    </n-modal>
  </DataTableLayout>
</template>

<script lang="ts" setup>
import { deleteRecordApi } from '@src/api/endpoints';
import { usePermission } from '@src/utils/permission/usePermission';
import { usePagination } from '@src/hooks/pagination/usePagination';
import { useLoading } from '@src/hooks/useLoading';
import { useEnv } from '@src/hooks/useEnv';
import { useMobile } from '@src/hooks/useMediaQuery';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDialog, useMessage } from 'naive-ui';
import { NIcon, NPagination } from 'naive-ui';
import { MoreOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@vicons/antd';
import DataTableLayout from '@src/layouts/DataTableLayout/index.vue';
import AddUser from '@src/components/users/AddUser.vue';
import EditUser from '@src/components/users/EditUser.vue';
import { renderIcon } from '@src/utils/renderIcon';

const { imgUrl } = useEnv();
const router = useRouter();
const isMobile = useMobile();
const dialog = useDialog();
const selectedOption: any = ref(null);
const showModal = ref(false);
const showEditModal = ref(false);
const selectedId = ref();
const { hasPermission } = usePermission();
const message: any = useMessage();
const [loading, loadingDispatcher] = useLoading(false);

// fetch all records
const { getList, list, page, pageSizes, itemCount, pageSize, searchParams }: any =
  usePagination('/users');

onMounted(() => {
  getList();
});

const moreOptions = ref([
  {
    label: 'Assign Permission',
    key: 'assign_permission',
    icon: renderIcon(EditOutlined),
    permission: hasPermission(['can view user update'])
  },
  {
    label: 'Edit',
    key: 'edit',
    icon: renderIcon(EditOutlined),
    permission: hasPermission(['can view user update'])
  },
  {
    label: 'Delete',
    key: 'delete',
    icon: renderIcon(DeleteOutlined),
    permission: hasPermission(['can view user delete'])
  }
]);

const filteredOptions = computed(() => {
  return moreOptions.value.filter((option) => option.permission);
});

function confirmationDialog() {
  dialog.error({
    title: 'Confirmation',
    content: () => 'Are you sure you want to delete?',
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: deleteOperation
  });
}

function deleteOperation() {
  loadingDispatcher.loading();
  deleteRecordApi(`/users/${selectedId.value}`)
    .then((result: any) => {
      message.success(result.message);
      getList();
      loadingDispatcher.loaded();
      dialog.destroyAll;
    })
    .catch((result: any) => {
      message.error(result.message);
      loadingDispatcher.loaded();
      dialog.destroyAll;
    });
  selectedId.value = null;
  selectedOption.value = null;
}

const actionOperation = (item: any) => {
  if (selectedOption.value === 'assign_permission') {
    router.push({
      name: 'system_assing_permission',
      query: { userId: item.id }
    });
  } else if (selectedOption.value === 'edit') {
    showEditModal.value = true;
    selectedId.value = item.id;
  } else if (selectedOption.value === 'delete') {
    selectedId.value = item.id;
    confirmationDialog();
  }
};
const selectedAction = (key: any) => {
  selectedOption.value = key;
};
const fetchList = () => {
  getList(searchParams.value);
};
</script>

<style lang="scss" scoped>
.table {
  @apply w-full text-sm text-left text-gray-500 dark:text-gray-400;
}
.head {
  @apply sticky top-0 text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 z-20;
}
.th {
  @apply px-6 py-3 border-r border-b border-gray-200 dark:border-gray-800 text-center whitespace-nowrap;
}
.body_tr {
  @apply hover:bg-gray-50 dark:hover:bg-gray-600;
}
.td {
  @apply px-3 border-r border-b border-gray-200 dark:border-gray-800 whitespace-nowrap;
}
.sticky_el {
  @apply sticky bg-gray-50 dark:bg-gray-700 px-6 whitespace-nowrap text-center border border-gray-200 dark:border-gray-800;
}

.data_placeholder {
  text-align: center;
  color: gray;
  padding: 20px 0;
  font-size: 18px;
  font-style: italic;
}
</style>
