<template>
  <div :loading="loading" class="h-full">
    <div class="flex justify-between items-center p-3 sticky top-0">
      <h3 class="text-lg">Variant List</h3>
      <NButton
        secondary
        type="info"
        :size="isMobile ? 'small' : 'medium'"
        @click="showModal = true"
        v-permission="{ action: ['can view variant create'] }"
      >
        Create
      </NButton>
    </div>
    <div class="variant_container h-full">
      <table class="table">
        <thead class="head">
          <tr>
            <th class="sticky_el left-0 z-20">ID</th>
            <th class="th">Images</th>
            <th class="th">Variant Code</th>
            <th class="th">Attribute Name</th>
            <th class="th">Attribute Value</th>
            <th class="th">Status</th>
            <th class="th">Stock Status</th>
            <th class="th">Quantity</th>
            <th class="th">Price</th>
            <th class="th">Regular Price</th>
            <th class="th">Created At</th>
            <th class="th">Updated At</th>
            <th
              class="sticky_el right-0 z-20"
              v-permission="{
                action: ['can view variant update', 'can view variant delete']
              }"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0">
            <td colspan="13" class="data_placeholder">Record Not Exist</td>
          </tr>
          <tr v-else v-for="item in list" :key="item.id" class="body_tr">
            <td class="sticky_el left-0 z-10">
              {{ item.id }}
            </td>
            <td class="td flex gap-3 pt-2">
              <div v-for="img in item.images" :key="img.id">
                <n-avatar :size="50" :src="`${imgUrl}${img.images}`" />
              </div>
            </td>
            <td class="td">{{ item.sku_id }}</td>
            <td class="td">{{ item.attributes.name }}</td>
            <td class="td">{{ item.attribute_value }}</td>
            <td class="text-center td">
              <n-tag :bordered="false" type="info">{{ item.status }}</n-tag>
            </td>
            <td class="text-center td">
              <n-tag :bordered="false" type="info">{{ item.stock_status }}</n-tag>
            </td>
            <td class="td">{{ item.stock_quantity }}</td>
            <td class="td">{{ item.price }}</td>
            <td class="td">{{ item.regular_price }}</td>
            <td class="td">{{ item.created_at }}</td>
            <td class="td">{{ item.updated_at }}</td>
            <td
              class="sticky_el right-0 z-10"
              v-permission="{
                action: ['can view variant update', 'can view variant delete']
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
    </div>
    <n-modal style="width: 60%" v-model:show="showModal" preset="dialog">
      <template #header>
        <div>Create New Variant</div>
      </template>
      <n-space :vertical="true">
        <add-variant
          @created="
            getVariantList();
            showModal = false;
          "
        />
      </n-space>
    </n-modal>

    <n-modal style="width: 60%" v-model:show="showEditModal" preset="dialog">
      <template #header>
        <div>Update Variant</div>
      </template>
      <n-space :vertical="true">
        <edit-variant
          :id="selectedId"
          @updated="
            getVariantList();
            showEditModal = false;
          "
        />
      </n-space>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDialog, useMessage } from 'naive-ui';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@vicons/antd';
import { useEnv } from '@src/hooks/useEnv';
import { renderIcon } from '@src/utils/renderIcon';
import { useLoading } from '@src/hooks/useLoading';
import { deleteRecordApi, getRecordApi } from '@src/api/endpoints';
import AddVariant from '@src/components/products/variants/AddVariant.vue';
import EditVariant from '@src/components/products/variants/EditVariant.vue';
import { usePermission } from '@src/utils/permission/usePermission';
import { useMobile } from '@src/hooks/useMediaQuery';

const props = defineProps<{
  variants: Record<string, any>;
}>();

const list: any = ref(props.variants);
const { imgUrl } = useEnv();
const isMobile = useMobile();
const route = useRoute();
const dialog = useDialog();
const { hasPermission } = usePermission();
const selectedOption: any = ref(null);
const selectedId = ref();
const showModal = ref(false);
const showEditModal = ref(false);
const message: any = useMessage();
const [loading, loadingDispatcher] = useLoading(false);

console.log('getVariantsByProduct ===>', list);

const moreOptions = ref([
  {
    label: 'Edit',
    key: 'edit',
    icon: renderIcon(EditOutlined),
    permission: hasPermission(['can view variant update'])
  },
  {
    label: 'Delete',
    key: 'delete',
    icon: renderIcon(DeleteOutlined),
    permission: hasPermission(['can view variant delete'])
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
  deleteRecordApi(`/variants/${selectedId.value}`)
    .then((res: any) => {
      message.success(res.message);
      getVariantList();
      loadingDispatcher.loaded();
      dialog.destroyAll;
    })
    .catch((res: any) => {
      message.error(res.message);
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
    // router.push(`/roles/${item.id}`);
  } else if (selectedOption.value === 'delete') {
    selectedId.value = item.id;
    confirmationDialog();
  }
};
const selectedAction = (key: any) => {
  selectedOption.value = key;
};

const getVariantList = () => {
  getRecordApi(`/variants/getVariantsByProduct/${route.params.id}`).then((res: any) => {
    list.value = res.result;
  });
};
</script>

<style lang="scss" scoped>
.variant_container {
  @apply relative overflow-x-auto sm:rounded-lg;
}
.table {
  @apply w-full text-sm text-left text-gray-500 dark:text-gray-400;
}
.head {
  @apply sticky top-0 text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 z-20;
}
.th {
  @apply px-6 py-3 border border-gray-200 dark:border-gray-800 text-center whitespace-nowrap;
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
