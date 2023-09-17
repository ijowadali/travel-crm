<template>
  <DataTableLayout :loading="loading" v-permission="{ action: ['can view attributes'] }">
    <template #tableHeader>
      <div class="flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <div class="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
          <div class="flex w-full items-center !space-x-2 sm:w-fit">
            <NInput
              v-model:value="searchParams.name"
              class="sm:!w-[200px]"
              clearable
              placeholder="Search by Name"
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
            v-permission="{ action: ['can view attribute create'] }"
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
            <th class="th">Attribute Name</th>
            <th class="th">Created At</th>
            <th class="th">Updated At</th>
            <th
              class="sticky_el right-0 z-20"
              v-permission="{
                action: ['can view attribute update', 'can view attribute delete']
              }"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0">
            <td colspan="5" class="data_placeholder">Record is Empty</td>
          </tr>
          <tr v-else v-for="item in list" :key="item.id" class="body_tr">
            <td class="sticky_el left-0 z-10">{{ item.id }}</td>
            <td class="td">{{ item.name }}</td>
            <td class="td">{{ item.created_at }}</td>
            <td class="td">{{ item.updated_at }}</td>
            <td
              class="sticky_el right-0 z-10"
              v-permission="{
                action: ['can view attribute update', 'can view attribute delete']
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

    <n-modal v-model:show="showModal" preset="dialog">
      <template #header>
        <div>Create New Attribute</div>
      </template>
      <n-space :vertical="true">
        <add-attribute
          @created="
            getList();
            showModal = false;
          "
        />
      </n-space>
    </n-modal>

    <n-modal v-model:show="showEditModal" preset="dialog">
      <template #header>
        <div>Update Attribute</div>
      </template>
      <n-space :vertical="true">
        <edit-attribute
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
import { ref, onMounted, h, computed } from 'vue';
import type { Component } from 'vue';
import { useDialog, useMessage, NIcon, NPagination } from 'naive-ui';
import { MoreOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@vicons/antd';
import AddAttribute from '@src/components/products/attributes/AddAttribute.vue';
import EditAttribute from '@src/components/products/attributes/EditAttribute.vue';
import DataTableLayout from '@src/layouts/DataTableLayout/index.vue';
import { useMobile } from '@src/hooks/useMediaQuery';

const dialog = useDialog();
const isMobile = useMobile();
const showModal = ref(false);
const selectedOption: any = ref(null);
const showEditModal = ref(false);
const selectedId = ref();
const { hasPermission } = usePermission();
const message: any = useMessage();
const [loading, loadingDispatcher] = useLoading(false);

// fetch all records
const { getList, list, page, pageSizes, itemCount, pageSize, searchParams }: any =
  usePagination('/attributes');

onMounted(() => {
  getList();
});

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
    permission: hasPermission(['can view attribute update'])
  },
  {
    label: 'Delete',
    key: 'delete',
    icon: renderIcon(DeleteOutlined),
    permission: hasPermission(['can view attribute delete'])
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
  deleteRecordApi(`/attributes/${selectedId.value}`)
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
