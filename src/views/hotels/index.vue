<template>
  <n-card title="Hotels">
    <n-space :vertical="true">
      <n-row gutter="12">
        <n-col :span="4">
          <n-select
            v-model:value="params.name"
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
        </n-col>
        <n-col :span="4">
          <n-input
            v-model:value="params.owner"
            clearable
            placeholder="Search By Owner Name"
            size="small"
            type="text"
          />
        </n-col>
        <n-col :span="4">
          <n-input
            v-model:value="params.city"
            clearable
            placeholder="Search By City"
            size="small"
            type="text"
          />
        </n-col>
        <n-col :span="4">
          <n-select
            v-model:value="params.is_active"
            :options="[
              { label: 'Active', value: 1 },
              { label: 'Inactive', value: 0 },
            ]"
            clearable
            filterable
            placeholder="Select Status"
            size="small"
          />
        </n-col>
        <n-col :span="4">
          <n-button secondary size="small" strong type="info" @click="fetchList"> Search</n-button>
        </n-col>
      </n-row>
      <n-table :bordered="true" :single-line="false" :striped="true" size="small">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hotel Name</th>
            <th>Hotel Phone</th>
            <th>Owner Name</th>
            <th>Owner Phone</th>
            <th>Address</th>
            <th>City</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0">
            <td class="data_placeholder" colspan="8"> Record Not Exist</td>
          </tr>
          <tr v-for="item in list" v-else :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.phone_number }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.owner_phone }}</td>
            <td>
              {{ item.address + ' ' + item.city + ' ' + item.state + ' ' + item.country }}
            </td>
            <td>
              {{ item.city }}
            </td>
            <td>
              <n-tag v-if="item.is_active" round size="small" type="success"> Active</n-tag>
              <n-tag v-else round size="small" type="error"> Inactive</n-tag>
            </td>
            <td>{{ item.created_at }}</td>
            <td>
              <n-dropdown
                :onSelect="selectedAction"
                :options="moreOptions"
                trigger="click"
                @click="actionOperation(item)"
              >
                <n-button :circle="true" size="small">
                  <n-icon>
                    <more-outlined />
                  </n-icon>
                </n-button>
              </n-dropdown>
            </td>
          </tr>
        </tbody>
      </n-table>
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :item-count="itemCount"
        :page-sizes="pageSizes"
        :show-quick-jumper="true"
        :show-size-picker="true"
        size="small"
      />
    </n-space>
    <n-button
      v-if="permission.hasPermission(['can add hotel'])"
      :circle="true"
      size="large"
      style="position: fixed; bottom: 30px; right: 40px"
      type="primary"
      @click="showModal = true"
    >
      <template #icon>
        <n-icon>
          <plus-outlined />
        </n-icon>
      </template>
    </n-button>
    <n-modal v-model:show="showModal" preset="dialog" style="width: 70%">
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
    <n-modal v-model:show="showEditModal" preset="dialog" style="width: 70%">
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
  </n-card>
</template>
<script lang="ts" setup>
  import { deleteHotelApi, getHotelsApi } from '@/api/hotel/hotel';
  import { userPagination } from '@/hooks/userPagination';
  import type { Component } from 'vue';
  import { h, onMounted, ref } from 'vue';
  import { NIcon, NPagination, useDialog, useMessage } from 'naive-ui';
  import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@vicons/antd';
  import AddHotel from '@/components/hotels/AddHotel.vue';
  import EditHotel from '@/components/hotels/EditHotel.vue';
  import { usePermission } from '@/hooks/web/usePermission';
  import { filterHotel } from '@/filters/hotels';

  const dialog = useDialog();
  const showModal = ref(false);
  const showEditModal = ref(false);
  const selectedOption: any = ref(null);
  const selectedId = ref();
  const message = useMessage();
  const permission = usePermission();
  const { hotels, hotelLoading, findHotel, getHotelsOnFocus } = filterHotel();
  const { getList, list, page, pageSizes, itemCount, pageSize, params }: any =
    userPagination(getHotelsApi);
  const renderIcon = (icon: Component) => {
    return () => {
      return h(NIcon, null, {
        default: () => h(icon),
      });
    };
  };

  const moreOptions = ref([
    {
      label: 'Edit',
      key: 'edit',
      icon: renderIcon(EditOutlined),
    },
    {
      label: 'Delete',
      key: 'delete',
      icon: renderIcon(DeleteOutlined),
    },
  ]);

  function confirmationDialog() {
    dialog.error({
      title: 'Confirmation',
      content: () => 'Are you sure you want to delete?',
      positiveText: 'Delete',
      negativeText: 'Cancel',
      onPositiveClick: deleteOperation,
    });
  }

  function deleteOperation() {
    const Loading = window['$loading'] || null;
    Loading.start();
    deleteHotelApi(selectedId.value)
      .then((result: any) => {
        message.success(result.message);
        getList();
        Loading.finish();
        dialog.destroyAll;
      })
      .catch((result) => {
        message.error(result.message);
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
    getList(params.value);
  };
  onMounted(() => {
    getList();
  });
</script>
<style lang="less" scoped>
  .data_placeholder {
    text-align: center;
    color: gray;
    padding: 20px 0;
    font-size: 18px;
    font-style: italic;
  }
</style>
