<template>
  <DataTableLayout v-permission="{ action: ['can view bookings'] }">
    <template #tableHeader>
      <div class="flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <div class="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
          <div class="flex w-full items-center !space-x-2 sm:w-fit">
            <n-input
              v-model:value="searchParams.customer_name"
              class="sm:!w-[215px]"
              clearable
              placeholder="Search by Customer Name"
              size="small"
              type="text"
            />
            <n-select
              v-model:value="searchParams.status"
              class="sm:!w-[200px]"
              :options="[
                { label: 'Draft', value: 'draft' },
                { label: 'Processing', value: 'processing' },
                { label: 'Final', value: 'final' }
              ]"
              clearable
              filterable
              placeholder="Select Booking Status"
              size="small"
            />
            <n-select
              v-model:value="searchParams.category"
              class="sm:!w-[150px]"
              :options="[
                { label: 'Basic', value: 'basic' },
                { label: 'Individual', value: 'individual' },
                { label: 'Premium', value: 'premium' },
                { label: 'VIP', value: 'vip' }
              ]"
              clearable
              filterable
              placeholder="Select Category"
              size="small"
            />
            <n-select
              v-model:value="searchParams.confirmed_ticket"
              class="sm:!w-[200px]"
              :options="[
                { label: 'Yes', value: 1 },
                { label: 'No', value: 0 }
              ]"
              clearable
              filterable
              placeholder="Select Ticket Status"
              size="small"
            />
            <n-input
              v-model:value="searchParams.group_name"
              class="sm:!w-[150px]"
              clearable
              placeholder="Search by Group Name"
              size="small"
              type="text"
              @change="fetchList"
            />
            <n-button secondary size="small" type="info" @click="fetchList"> Search </n-button>
          </div>
        </div>
        <div class="flex w-full items-center justify-between space-x-3 sm:justify-end">
          <NButton
            secondary
            type="info"
            :size="isMobile ? 'small' : 'medium'"
            @click="router.push({ name: 'booking_add' })"
            v-permission="{ action: ['can view booking create'] }"
          >
            Create
          </NButton>
        </div>
      </div>
    </template>

    <template #tableContent>
      <table class="table">
        <thead class="head">
          <tr>
            <th class="th">Name</th>
            <th class="th">Booking Status</th>
            <th class="th">Category</th>
            <th class="th">Group No</th>
            <th class="th">Created At</th>
            <th class="th">Updated At</th>
            <th
              class="sticky_el right-0 z-20"
              v-permission="{
                action: ['can view booking update', 'can view booking delete']
              }"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0">
            <td colspan="8" class="data_placeholder">Record Not Exist</td>
          </tr>
          <tr v-else v-for="item in list" :key="item.id" class="body_tr">
            <td class="td">{{ item.customer_name }}</td>
            <td class="text-center td">
              <n-tag :bordered="false" type="info">{{ item.status }}</n-tag>
            </td>
            <td class="td">{{ item.category }}</td>
            <td class="td">{{ item.group_no }}</td>
            <td class="td">{{ item.created_at }}</td>
            <td class="td">{{ item.updated_at }}</td>
            <td
              class="sticky_el right-0 z-10"
              v-permission="{
                action: ['can view booking update', 'can view booking delete']
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
        >
          <template #prefix="{ itemCount }"> Total: {{ itemCount }} </template>
        </n-pagination>
      </div>
    </template>
    <!-- <router-link to="/booking/add-booking">
      <n-button
        :circle="true"
        size="large"
        style="position: fixed; bottom: 30px; right: 40px"
        type="primary"
      >
        <template #icon>
          <n-icon>
            <plus-outlined />
          </n-icon>
        </template>
      </n-button>
    </router-link> -->
  </DataTableLayout>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { NIcon, NPagination, useDialog } from 'naive-ui';
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined
  // PlusOutlined,
  // SearchOutlined
} from '@vicons/antd';
import { PrintAdd24Regular } from '@vicons/fluent';
import { deleteRecordApi } from '@src/api/endpoints';
import { usePermission } from '@src/utils/permission/usePermission';
import { usePagination } from '@src/hooks/pagination/usePagination';
import DataTableLayout from '@src/layouts/DataTableLayout/index.vue';
// import { useLoading } from '@src/hooks/useLoading';
import { useMobile } from '@src/hooks/useMediaQuery';
import { renderIcon } from '@src/utils/renderIcon';

const dialog = useDialog();
const router = useRouter();
const isMobile = useMobile();
const selectedOption: any = ref(null);
const selectedId = ref();
const { hasPermission } = usePermission();
// const [loading, loadingDispatcher] = useLoading(false);
const { getList, list, page, pageSizes, itemCount, pageSize, searchParams }: any =
  usePagination('/bookings');

const moreOptions = ref([
  {
    label: 'Print',
    key: 'print',
    icon: renderIcon(PrintAdd24Regular),
    permission: hasPermission(['can view booking print'])
  },
  {
    label: 'Edit',
    key: 'edit',
    icon: renderIcon(EditOutlined),
    permission: hasPermission(['can view booking update'])
  },
  {
    label: 'Delete',
    key: 'delete',
    icon: renderIcon(DeleteOutlined),
    permission: hasPermission(['can view booking delete'])
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
  // const Loading = window['$loading'] || null;
  // Loading.start();
  deleteRecordApi(`/bookings/${selectedId.value}`)
    .then((res: any) => {
      console.log('first', res);
      window['$message'].success(res.message);
      getList();
      // Loading.finish();
      dialog.destroyAll;
    })
    .catch((res: any) => {
      window['$message'].error(res.message);
      // Loading.finish();
      dialog.destroyAll;
    });
  selectedId.value = null;
  selectedOption.value = null;
}

const actionOperation = (item: any) => {
  if (selectedOption.value === 'edit') {
    router.push({ name: 'booking_update', params: { id: item.id } });
    // router.push(`/booking/edit-booking/${item.id}`);
  } else if (selectedOption.value === 'delete') {
    selectedId.value = item.id;
    confirmationDialog();
  } else if (selectedOption.value === 'print') {
    // selectedId.value = item.id;
    router.push({ name: 'booking_print', params: { id: item.id } });
    // router.push(`/booking/print-booking?booking_id=${item.id}`);
  }
};
const selectedAction = (key: any) => {
  selectedOption.value = key;
};
const fetchList = () => {
  getList(searchParams.value);
};
onMounted(() => {
  getList();
});
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
  @apply px-3 py-2 border-r border-b border-gray-200 dark:border-gray-800 whitespace-nowrap;
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
