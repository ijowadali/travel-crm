<template>
  <DataTableLayout v-permission="{ action: ['can view hotels'] }">
    <template #tableHeader>
      <div class="flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <div class="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
          <div class="flex w-full items-center !space-x-2 sm:w-fit">
            <!-- <NInput
              v-model:value="searchParams.name"
              class="sm:!w-[240px]"
              clearable
              placeholder="Search by Permission Name"
              @keyup="fetchList"
            >
              <template #prefix>
                <NIcon :component="SearchOutlined" class="mr-1" />
              </template>
            </NInput> -->
            <n-select
              class="sm:!w-[200px]"
              v-model:value="searchParams.name"
              :clear-filter-after-select="false"
              :filterable="true"
              :loading="hotelLoading"
              :options="hotels"
              :remote="true"
              :tag="false"
              clearable
              label-field="name"
              placeholder="Select Hotel"
              size="small"
              value-field="name"
              @focus="getHotelsOnFocus"
              @search="findHotel"
            />
            <n-input
              class="sm:!w-[200px]"
              v-model:value="searchParams.owner"
              clearable
              placeholder="Search By Owner Name"
              size="small"
              type="text"
            />
            <n-select
              class="sm:!w-[200px]"
              v-model:value="searchParams.status"
              :options="[
                { label: 'Active', value: 'active' },
                { label: 'Disabled', value: 'disabled' }
              ]"
              clearable
              filterable
              placeholder="Select Status"
              size="small"
            />
            <n-button secondary size="small" strong type="info" @click="fetchList">
              Search
            </n-button>
          </div>
        </div>
        <div class="flex w-full items-center justify-between space-x-3 sm:justify-end">
          <NButton
            secondary
            type="info"
            :size="isMobile ? 'small' : 'medium'"
            @click="showModal = true"
            v-permission="{ action: ['can view hotel create'] }"
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
            <th class="sticky_el left-0 z-20">ID</th>
            <th class="th">Hotel Name</th>
            <th class="th">Hotel Phone</th>
            <th class="th">Owner Name</th>
            <th class="th">Owner Phone</th>
            <th class="th">Status</th>
            <th class="th">Address</th>
            <th class="th">Created At</th>
            <th class="th">Updated At</th>
            <th
              class="sticky_el right-0 z-20"
              v-permission="{
                action: ['can view hotel update', 'can view hotel delete']
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
          <tr v-else v-for="item in list" :key="item.id">
            <td class="sticky_el left-0 z-10">{{ item.id }}</td>
            <td class="td">{{ item.name }}</td>
            <td class="td">{{ item.phone_number }}</td>
            <td class="td">{{ item.owner }}</td>
            <td class="td">{{ item.owner_phone }}</td>
            <td class="text-center td">
              <n-tag :bordered="false" :type="item.status === 'disabled' ? 'error' : 'info'">
                {{ item.status }}
              </n-tag>
            </td>
            <td class="td">
              {{ item.address + ' ' + item.city + ' ' + item.state + ' ' + item.country }}
            </td>
            <td class="td">{{ item.created_at }}</td>
            <td class="td">{{ item.updated_at }}</td>
            <td
              class="sticky_el right-0 z-10"
              v-permission="{
                action: ['can view hotel update', 'can view hotel delete']
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
    <!-- <n-button
      type="primary"
      size="large"
      :circle="true"
      style="position: fixed; bottom: 30px; right: 40px"
      @click="showModal = true"
      v-permission="{ action: ['can view hotel create'] }"
    >
      <template #icon>
        <n-icon>
          <plus-outlined />
        </n-icon>
      </template>
    </n-button> -->

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

    <n-modal style="width: 70%" v-model:show="showModal" preset="dialog">
      <template #header>
        <div>Create New Hotel</div>
      </template>
      <n-space :vertical="true">
        <add-hotel
          @created="
            getList();
            showModal = false;
          "
        />
      </n-space>
    </n-modal>

    <n-modal style="width: 70%" v-model:show="showEditModal" preset="dialog">
      <template #header>
        <div>Update Hotel</div>
      </template>
      <n-space :vertical="true">
        <edit-hotel
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
import { ref, onMounted, h, type Component, computed } from 'vue';
import { NIcon, NPagination, useDialog } from 'naive-ui';
import { deleteRecordApi } from '@src/api/endpoints';
import { usePermission } from '@src/utils/permission/usePermission';
import { usePagination } from '@src/hooks/pagination/usePagination';
// import { useLoading } from '@src/hooks/useLoading';
import { useMobile } from '@src/hooks/useMediaQuery';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined
  // PlusOutlined,
  // SearchOutlined
} from '@vicons/antd';
import DataTableLayout from '@src/layouts/DataTableLayout/index.vue';
import AddHotel from '@src/components/hotels/AddHotel.vue';
import EditHotel from '@src/components/hotels/EditHotel.vue';
import { usefilterHotel } from '@src/filters/hotels';

const dialog = useDialog();
const isMobile = useMobile();
const showModal = ref(false);
const showEditModal = ref(false);
const selectedOption: any = ref(null);
const selectedId = ref();
const { hasPermission } = usePermission();
// const [loading, loadingDispatcher] = useLoading(false);
const { hotels, hotelLoading, findHotel, getHotelsOnFocus } = usefilterHotel();

const { getList, list, page, pageSizes, itemCount, pageSize, searchParams }: any =
  usePagination('/hotels');

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
};

const moreOptions = ref([
  {
    label: 'Edit',
    key: 'edit',
    icon: renderIcon(EditOutlined),
    permission: hasPermission(['can view hotel update'])
  },
  {
    label: 'Delete',
    key: 'delete',
    icon: renderIcon(DeleteOutlined),
    permission: hasPermission(['can view hotel update'])
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
  const Loading = window['$loading'] || null;
  Loading.start();
  deleteRecordApi(`/hotels/${selectedId.value}`)
    .then((result: any) => {
      window['$message'].success(result.message);
      getList();
      Loading.finish();
      dialog.destroyAll;
    })
    .catch((result) => {
      window['$message'].error(result.message);
      Loading.finish();
      dialog.destroyAll;
    });
  selectedId.value = null;
  selectedOption.value = null;
}

const actionOperation = (item: any) => {
  if (selectedOption.value === 'edit') {
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

onMounted(() => {
  getList();
});

// const status = ref([
//   {
//     label: 'Active',
//     value: 'active'
//   },
//   {
//     label: 'Disabled',
//     value: 'disabled'
//   }
// ]);
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
  @apply px-3 py-3 border-r border-b border-gray-200 dark:border-gray-800 whitespace-nowrap;
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
