<template>
  <DataTableLayout v-permission="{ action: ['can view rooms'] }">
    <template #tableHeader>
      <div class="flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <div class="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
          <div class="flex w-full items-center !space-x-2 sm:w-fit">
            <NInput
              v-model:value="searchParams.name"
              class="sm:!w-[250px]"
              clearable
              placeholder="Search by Room Name"
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
            v-permission="{ action: ['can view room create'] }"
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
            <th class="th">Hotel Name</th>
            <th class="th">Floor No</th>
            <th class="th">Room No</th>
            <th class="th">Room Type</th>
            <th class="th">No of Beds</th>
            <th class="th">Beds</th>
            <th class="th">Status</th>
            <th class="th">Price Type</th>
            <th class="th">Purchase Price</th>
            <th class="th">Sale Price</th>
            <th class="th">Created At</th>
            <th class="th">Updated At</th>
            <th
              class="sticky_el right-0 z-20"
              v-permission="{
                action: ['can view room update', 'can view room delete']
              }"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0">
            <td colspan="11" class="data_placeholder">Record Not Exist</td>
          </tr>
          <tr v-else v-for="item in list" :key="item.id">
            <td class="td">{{ item.hotels.name }}</td>
            <td class="td">{{ item.floor_no }}</td>
            <td class="td">{{ item.room_no }}</td>
            <td class="td">{{ item.room_type }}</td>
            <td class="td">{{ item.no_of_bed }}</td>
            <td class="td">
              <n-button size="small" secondary type="info" @click="handleViewBeds(item)"
                >View Beds</n-button
              >
            </td>
            <td class="text-center td">
              <n-tag :bordered="false" :type="item.status === 'disabled' ? 'error' : 'success'">
                {{ item.status }}
              </n-tag>
            </td>
            <td class="td">{{ item.price_type }}</td>
            <td class="td">{{ item.purchase_price }}</td>
            <td class="td">{{ item.sale_price }}</td>
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

    <!-- <n-button
      type="primary"
      size="large"
      :circle="true"
      style="position: fixed; bottom: 30px; right: 40px"
      @click="showModal = true"
      v-permission="{ action: ['can view room create'] }"
    >
      <template #icon>
        <n-icon>
          <plus-outlined />
        </n-icon>
      </template>
    </n-button> -->

    <n-modal style="width: 60%" v-model:show="showModal" preset="dialog">
      <template #header>
        <div>Create New Room</div>
      </template>
      <n-space :vertical="true">
        <add-room
          @created="
            getList();
            showModal = false;
          "
        />
      </n-space>
    </n-modal>

    <n-modal style="width: 60%" v-model:show="showEditModal" preset="dialog">
      <template #header>
        <div>Update Room</div>
      </template>
      <n-space :vertical="true">
        <edit-room
          :id="selectedId"
          @updated="
            getList();
            showEditModal = false;
          "
        />
      </n-space>
    </n-modal>

    <n-modal style="width: 40%" v-model:show="showViewBedsModal" preset="dialog">
      <template #header>
        <div>View Beds</div>
      </template>
      <n-space :vertical="true">
        <view-beds :bedsData="bedsData" />
      </n-space>
    </n-modal>
  </DataTableLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted, h, type Component, computed } from 'vue';
import { useDialog, NIcon, NPagination } from 'naive-ui';
import { deleteRecordApi } from '@src/api/endpoints';
import { usePermission } from '@src/utils/permission/usePermission';
import { usePagination } from '@src/hooks/pagination/usePagination';
import { useMobile } from '@src/hooks/useMediaQuery';
// import { useLoading } from '@src/hooks/useLoading';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  // PlusOutlined,
  SearchOutlined
} from '@vicons/antd';
import DataTableLayout from '@src/layouts/DataTableLayout/index.vue';
import AddRoom from '@src/components/hotels/rooms/AddRoom.vue';
import EditRoom from '@src/components/hotels/rooms/EditRoom.vue';
import ViewBeds from '@src/components/hotels/rooms/ViewBeds.vue';

const dialog = useDialog();
const isMobile = useMobile();
const selectedId = ref();
const selectedOption: any = ref(null);
const showModal = ref(false);
const showEditModal = ref(false);
const showViewBedsModal = ref(false);
const bedsData = ref([]);
const { hasPermission } = usePermission();
// const [loading, loadingDispatcher] = useLoading(false);

const { getList, list, page, pageSizes, itemCount, pageSize, searchParams }: any =
  usePagination('/rooms');

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
    permission: hasPermission(['can view room update'])
  },
  {
    label: 'Delete',
    key: 'delete',
    icon: renderIcon(DeleteOutlined),
    permission: hasPermission(['can view room delete'])
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
  deleteRecordApi(`/rooms/${selectedId.value}`)
    .then((res: any) => {
      window['$message'].success(res.result.message);
      getList();
      Loading.finish();
    })
    .catch((res) => {
      window['$message'].error(res.result.message);
      Loading.finish();
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

const handleViewBeds = (item: any) => {
  bedsData.value = item.beds;
  showViewBedsModal.value = true;
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
