<template>
  <n-card title="Bookings">
    <n-space :vertical="true">
      <n-row gutter="12">
        <n-col :span="4">
          <n-input
            v-model:value="params.customer_name"
            clearable
            placeholder="Search by Name"
            size="small"
            type="text"
          />
        </n-col>
        <n-col :span="4">
          <n-select
            v-model:value="params.booking_status"
            :options="[
              { label: 'Draft', value: 'draft' },
              { label: 'Processing', value: 'processing' },
              { label: 'Final', value: 'final' },
            ]"
            clearable
            filterable
            placeholder="Select Booking Status"
            size="small"
          />
        </n-col>
        <n-col :span="4">
          <n-select
            v-model:value="params.category"
            :options="[
              { label: 'Basic', value: 'basic' },
              { label: 'Individual', value: 'individual' },
              { label: 'Premium', value: 'premium' },
              { label: 'VIP', value: 'vip' },
            ]"
            clearable
            filterable
            placeholder="Select Category"
            size="small"
          />
        </n-col>
        <n-col :span="4">
          <n-select
            v-model:value="params.confirmed_ticket"
            :options="[
              { label: 'Yes', value: 1 },
              { label: 'No', value: 0 },
            ]"
            clearable
            filterable
            placeholder="Select Ticket Status"
            size="small"
          />
        </n-col>
        <n-col :span="4">
          <n-input
            v-model:value="params.group_name"
            clearable
            placeholder="Search by Group Name"
            size="small"
            type="text"
            @change="fetchList"
          />
        </n-col>
        <n-col :span="4">
          <n-button secondary size="small" strong type="info" @click="fetchList"> Search</n-button>
        </n-col>
      </n-row>

      <n-table :striped="true">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Booking Status</th>
            <th>Category</th>
            <th>Group No</th>
            <th>Group Name</th>
            <th>Ticket Confirmed</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0">
            <td class="data_placeholder" colspan="7"> Record Not Exist</td>
          </tr>
          <tr v-for="item in list" v-else :key="item.id">
            <td>{{ item.customer_name }}</td>
            <td>
              <n-tag round size="small" type="success">
                {{ item.booking_status.toUpperCase() }}
              </n-tag>
            </td>
            <td>{{ item.category }}</td>
            <td>{{ item.group_no }}</td>
            <td>{{ item.group_name }}</td>
            <td>
              <n-tag v-if="item.confirmed_ticket" round size="small" type="success"> Yes</n-tag>
              <n-tag v-else round size="small" type="error"> No</n-tag>
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
      <n-space style="align-items: center; padding-top: 15px">
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
      <router-link to="/booking/add-booking">
        <n-button
          v-if="permission.hasPermission(['can add booking'])"
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
      </router-link>
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
  import { deleteBookingApi, getBookingsApi } from '@/api/booking/booking';
  import { userPagination } from '@/hooks/userPagination';
  import type { Component } from 'vue';
  import { h, onMounted, ref } from 'vue';
  import { NIcon, NPagination, useDialog, useMessage } from 'naive-ui';
  import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@vicons/antd';
  import { PrintAdd24Regular } from '@vicons/fluent';
  import { usePermission } from '@/hooks/web/usePermission';
  import router from '@/router';

  const dialog = useDialog();
  const selectedOption: any = ref(null);
  const selectedId = ref();
  const message = useMessage();
  const permission = usePermission();
  const { getList, list, page, pageSizes, itemCount, pageSize, params }: any =
    userPagination(getBookingsApi);
  const renderIcon = (icon: Component) => {
    return () => {
      return h(NIcon, null, {
        default: () => h(icon),
      });
    };
  };

  const moreOptions = ref([
    {
      label: 'Print',
      key: 'print',
      icon: renderIcon(PrintAdd24Regular),
    },
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
    deleteBookingApi(selectedId.value)
      .then((result) => {
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
      // showEditModal.value = true;
      // selectedId.value = item.id;
      router.push(`/booking/edit-booking/${item.id}`);
    } else if (selectedOption.value === 'delete') {
      selectedId.value = item.id;
      confirmationDialog();
    } else if (selectedOption.value === 'print') {
      selectedId.value = item.id;
      router.push(`/booking/print-booking?booking_id=${item.id}`);
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
