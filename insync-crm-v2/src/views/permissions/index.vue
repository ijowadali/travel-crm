<template>
  <DataTableLayout>
    <template #operate>
      <div class="flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <div class="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
          <div class="flex w-full items-center !space-x-2 sm:w-fit">
            <NInput
              v-model:value="queryParams.searchText"
              class="sm:!w-[200px]"
              clearable
              placeholder="KeywordSearch"
              @keydown.enter="queryList"
            >
              <template #prefix>
                <NIcon :component="DatabaseSearch20Regular" class="mr-1" />
              </template>
            </NInput>
            <NButton type="primary" size="small" @click="queryList"> Search </NButton>
          </div>
          <NDatePicker
            v-model:value="queryParams.daterange"
            class="sm:!w-[250px]"
            type="daterange"
            clearable
            input-readonly
            @update:value="() => queryList()"
          />
        </div>
        <!-- <div class="flex w-full items-center justify-between space-x-3 sm:justify-end">
          <NTooltip>
            <template #trigger>
              <NButton
                circle
                :size="isMobile ? 'small' : 'medium'"
                :disabled="loading"
                @click="handleReset"
              >
                <template #icon>
                  <NIcon :component="ResetIcon" />
                </template>
              </NButton>
            </template>
            {{ t('Common.Reset') }}
          </NTooltip>
          <NButton :size="isMobile ? 'small' : 'medium'" @click="handleCreateUser">
            {{ t('Common.Create') }}
          </NButton>
        </div> -->
      </div>
    </template>

    <NDataTable
      ref="tableRef"
      remote
      flex-height
      size="small"
      :scroll-x="3000"
      :columns="columns"
      :data="permissions"
      :loading="loading"
      :pagination="{
        ...pagination,
        simple: isMobile,
        showQuickJumper: true,
        showSizePicker: true,
        pageSlot: 9,
        pageSizes: [
          {
            label: `EachPage  ${ 10 }`,
            value: 10
          },
          {
            label: `EachPage ${ 20 }`,
            value: 20
          },
          {
            label: `EachPage ${  30 }`,
            value: 30
          },
          {
            label: `EachPage ${ 40 }`,
            value: 40
          }
        ],
        onUpdatePage: (page: number) => {
          pagination.page = page
          queryList()
        },
        onUpdatePageSize: (pageSize: number) => {
          pagination.page = 1
          pagination.pageSize = pageSize
          queryList()
        },
        prefix: (info) => { console.log('first',info); return `Total Page: ${  info.itemCount }`}
      }"
      @update:sorter="handleSorterChange"
      @update:page="() => queryList()"
    />
    <!-- @update:filters="handleFiltersChange" -->
    <!-- <NModal
      v-model:show="showResetPasswordDialog"
      preset="dialog"
      :title="t('UserManagement.ResetPassword')"
      :loading="resetPasswordLoading"
      :positive-text="t('Common.Confirm')"
      :negative-text="t('Common.Cancel')"
      @positive-click="handleConfirmPassword"
      @negative-click="handleResetPassword"
    >
      <template #icon>
        <NIcon size="24" :component="ResetPasswordIcon" />
      </template>
      <NForm ref="resetPasswordRef" :model="resetPasswordData" :rules="resetPasswordRules">
        <input type="text" name="username" autocomplete="username" style="display: none" />
        <NFormItem path="password" :label="t('User.Password')">
          <NInput
            v-model:value="resetPasswordData.password"
            type="password"
            :placeholder="t('User.Password')"
            maxlength="20"
            clearable
            show-password-on="click"
            :input-props="{ autocomplete: 'password' }"
            @keydown.enter="handleConfirmPassword"
          />
        </NFormItem>
      </NForm>
    </NModal> -->

    <!-- <UserFormModal
      ref="userFormModalRef"
      :is-edit="isEdit"
      :user-form-data="userFormData"
      @save="queryList"
    /> -->
  </DataTableLayout>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, h } from 'vue';
  import Dayjs from 'dayjs';
  import {
    DataTableBaseColumn,
    // DataTableFilterState,
    DataTableSortState,
    NAvatar,
    NButton,
    NIcon,
    NPopconfirm,
    // NTag,
    useMessage,
  } from 'naive-ui';
  import { DatabaseSearch20Regular } from '@vicons/fluent';
  import { UserCircle, Checkbox } from '@vicons/tabler';
  import { useLoading } from '@src/hooks/useLoading';
  import { BasePageModel } from '@src/constants/page';
  import { OrderType, Sorter } from '@src/types/request';
  import { getRecordsApi } from '@src/api/endpoints';
  // deleteRecordApi
  import { UserAPI } from '@src/api/user';
  import { useMobile } from '@src/hooks/useMediaQuery';
  import { TimeUtils } from '@src/utils/time';
  import DataTableLayout from '@src/layouts/DataTableLayout/index.vue';

  const message = useMessage();
  const isMobile = useMobile();
  const [loading, loadingDispatcher] = useLoading();
  const [enableLoading, enableLoadingDispatcher] = useLoading();
  // const [disableLoading, disableLoadingDispatcher] = useLoading();

  const queryParams = reactive({
    searchText: '',
    daterange: null,
    sorters: [] as Sorter[],
  });
  const permissions = ref<any[]>([]);

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
  });

  const idColumn: DataTableBaseColumn<any> = {
    title: 'ID',
    key: 'id',
    width: 50,
    titleAlign: 'center',
    align: 'center',
    sorter: true,
    fixed: 'left',
  };

  // sorter function
  const handleSorterChange = (options: DataTableSortState | null) => {
    if (!options) {
      return;
    }
    if (options.order) {
      queryParams.sorters = [
        {
          key: options.columnKey as string,
          order: OrderType[options.order],
        },
      ];
    } else {
      queryParams.sorters = [];
    }
    queryList();
  };

  // const handleFiltersChange = (filters: DataTableFilterState) => {
  //   const { authTypes } = filters;
  //   if (authTypes && Array.isArray(authTypes) && authTypes.length > 0) {
  //     queryParams.authTypes = authTypes.join();
  //   } else {
  //     queryParams.authTypes = '';
  //   }
  //   queryList();
  // };

  // table columns detail
  const columns = ref<DataTableBaseColumn<any>[]>([
    idColumn,
    {
      title: () => 'Avatar',
      key: 'avatar',
      width: 55,
      titleAlign: 'center',
      align: 'center',
      render: (row) =>
        h(
          'div',
          {
            class: 'flex align-center justify-center',
          },
          row.avatarUrl
            ? h(NAvatar, {
                src: row.avatarUrl,
                round: true,
                lazy: true,
                class: 'my-1',
              })
            : h(NIcon, {
                size: '40',
                depth: '3',
                component: UserCircle,
              })
        ),
    },
    {
      title: () => 'Username',
      key: 'username',
      width: 120,
      ellipsis: {
        tooltip: true,
      },
      fixed: !isMobile.value ? 'left' : undefined,
    },
    {
      title: () => 'PhoneNumber',
      key: 'phoneNumber',
      width: 120,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: () => 'Email',
      key: 'email',
      width: 100,
      resizable: true,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: () => 'Name',
      key: 'name',
      width: 100,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: () => 'LastName',
      key: 'lastName',
      width: 80,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: () => 'FirstName',
      key: 'firstName',
      width: 80,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: () => 'NickName',
      key: 'nickName',
      width: 120,
      resizable: true,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: () => 'Gender',
      key: 'genderLabel',
      width: 60,
      titleAlign: 'center',
      align: 'center',
    },
    {
      title: () => 'BirthDate',
      key: 'birthDate',
      width: 100,
      titleAlign: 'center',
      align: 'center',
      render: (row) => (row.birthDate ? TimeUtils.formatTime(row.birthDate, 'YYYY/MM/DD') : ''),
    },
    {
      title: () => 'Country',
      key: 'country',
      width: 80,
    },
    {
      title: () => 'Province',
      key: 'province',
      width: 80,
    },
    {
      title: () => 'City',
      key: 'city',
      width: 80,
    },
    {
      title: () => 'Address',
      key: 'address',
      width: 120,
      resizable: true,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: () => 'Biography',
      key: 'biography',
      width: 200,
      resizable: true,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: () => 'VerifyOrNot',
      key: 'verified',
      width: 100,
      titleAlign: 'center',
      align: 'center',
      render: (row) =>
        row.verified &&
        h(Checkbox, {
          class: 'inline',
        }),
    },
    {
      title: () => 'EnableOrNot',
      key: 'enabled',
      width: 100,
      titleAlign: 'center',
      align: 'center',
      render: (row) =>
        row.enabled &&
        h(Checkbox, {
          class: 'inline',
        }),
    },
    // createdAtColumn,
    // authTypeColumn,
    // {
    //   title: () => t('User.Roles'),
    //   key: 'roles',
    //   width: 200,
    //   render: (row) => {
    //     const tags = (row?.roles || []).map((role) =>
    //       h(
    //         NTag,
    //         {
    //           class: '!mr-2',
    //           type: 'primary',
    //           bordered: false,
    //         },
    //         {
    //           default: () => role,
    //         }
    //       )
    //     );
    //     return tags;
    //   },
    // },
    {
      title: () => 'Operation',
      key: 'operation',
      width: 320,
      titleAlign: 'center',
      align: 'center',
      fixed: !isMobile.value ? 'right' : undefined,
      render: (row) =>
        h(
          'div',
          {
            class: 'space-x-3 flex justify-center',
          },
          [
            h(
              NButton,
              {
                type: 'default',
                size: 'small',
                // onClick: () => {
                //   isEdit.value = true;
                //   userFormModalRef.value.handleShowModal();
                //   userFormData.value = row;
                // },
              },
              {
                default: () => 'Edit',
              }
            ),
            h(
              NPopconfirm,
              {
                showIcon: false,
                positiveButtonProps: {
                  loading: enableLoading.value,
                  disabled: enableLoading.value,
                },
                positiveText: 'Confirm',
                negativeText: 'Cancel',
                onPositiveClick: async () => {
                  if (!row.id) {
                    return;
                  }
                  enableLoadingDispatcher.loading();
                  await UserAPI.enableUser(row.id)
                    .then((res) => {
                      if (res.message) {
                        message.success(res.message);
                      }
                      queryList();
                    })
                    .catch((err) => {
                      if (err instanceof Error) {
                        message.error(err.message);
                      }
                    })
                    .finally(() => enableLoadingDispatcher.loaded());
                },
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      type: 'default',
                      size: 'small',
                    },
                    { default: () => 'Enable' }
                  ),
                default: () => 'IsOrNot Enable',
              }
            ),
            // h(
            //   NPopconfirm,
            //   {
            //     showIcon: false,
            //     positiveText: 'Confirm',
            //     negativeText: 'Cancel',
            //     positiveButtonProps: {
            //       loading: disableLoading.value,
            //       disabled: disableLoading.value,
            //     },
            //     onPositiveClick: async () => {
            //       if (!row.id) {
            //         return;
            //       }
            //       disableLoadingDispatcher.loading();
            //       await UserAPI.disableUser(row.id)
            //         .then((res) => {
            //           if (res.message) {
            //             message.success(res.message);
            //           }
            //           queryList();
            //         })
            //         .catch((err) => {
            //           if (err instanceof Error) {
            //             message.error(err.message);
            //           }
            //         })
            //         .finally(() => disableLoadingDispatcher.loaded());
            //     },
            //   },
            //   {
            //     trigger: () =>
            //       h(
            //         NButton,
            //         {
            //           type: 'default',
            //           size: 'small',
            //         },
            //         { default: () => 'Disable' }
            //       ),
            //     default: () => 'IsOrNot Disable',
            //   }
            // ),
            // h(
            //   NButton,
            //   {
            //     type: 'default',
            //     size: 'small',
            //     onClick: () => {
            //       showResetPasswordDialog.value = true;
            //       currentId.value = row.id;
            //     },
            //   },
            //   {
            //     default: () => t('UserManagement.ResetPassword'),
            //   }
            // ),
          ]
        ),
    },
  ]);

  // fetch all record
  const queryList = () => {
    if (loading.value) {
      return;
    }

    loadingDispatcher.loading();

    const params = new BasePageModel({
      page: pagination.page,
      pageSize: pagination.pageSize,
      searchText: queryParams.searchText,
      sorters: queryParams.sorters,
    });

    if (queryParams.daterange && Array.isArray(queryParams.daterange)) {
      const [startDate, endDate] = queryParams.daterange as string[];
      params.startDate = Dayjs(startDate).startOf('day').toISOString();
      params.endDate = Dayjs(endDate).endOf('day').toISOString();
    }

    getRecordsApi('/api/v1/permissions', params)
      .then((res: any) => {
        console.log('permissions list ==>', res);
        const { result } = res || {};
        permissions.value = result.data;
        pagination.itemCount = result.meta.total;
        message.success(res.message);
        console.log(pagination.itemCount);
      })
      .catch((e) => {
        console.log(e);
        message.error('LoadingDataError');
        permissions.value = [];
      })
      .finally(() => loadingDispatcher.loaded());
  };
  onMounted(() => queryList());
</script>

<style lang="scss" scoped></style>

<!-- <template>
  <n-card>
    <n-space :vertical="true">
      <n-input
        type="text"
        size="small"
        v-model:value="params.name"
        @change="fetchList"
        placeholder="Email"
      />
      <n-table :striped="true">
        <thead>
          <tr>
            <th>ID</th>
            <th>Permission Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0">
            <td colspan="7" class="data_placeholder"> Record Not Exist </td>
          </tr>
          <tr v-else v-for="item in list" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.created_at }}</td>
            <td>
              <n-dropdown
                @click="actionOperation(item)"
                :onSelect="selectedAction"
                trigger="click"
                :options="moreOptions"
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
      </n-table>
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :item-count="itemCount"
        :page-sizes="pageSizes"
        size="small"
        :show-quick-jumper="true"
        :show-size-picker="true"
      />
      <n-button
        type="primary"
        size="large"
        :circle="true"
        style="position: fixed; bottom: 30px; right: 40px"
        @click="showModal = true"
      >
        <template #icon>
          <n-icon>
            <plus-outlined />
          </n-icon>
        </template>
      </n-button>
      <n-modal style="width: 40%" v-model:show="showModal" preset="dialog">
        <template #header>
          <div>Create New Permission</div>
        </template>
        <n-space :vertical="true">
          <add-permission
            @created="
              getList();
              showModal = false;
            "
          />
        </n-space>
      </n-modal>

      <n-modal style="width: 40%" v-model:show="showEditModal" preset="dialog">
        <template #header>
          <div>Update Permission</div>
        </template>
        <n-space :vertical="true">
          <edit-permission
            :id="selectedId"
            @updated="
              getList();
              showEditModal = false;
            "
          />
        </n-space>
      </n-modal>
    </n-space>
  </n-card>
</template> -->

<!-- <script lang="ts" setup>
  import { getRecordsApi, deleteRecordApi } from '@src/api/endpoints';
  import { userPagination } from '@/hooks/userPagination';
  import { ref, onMounted, h } from 'vue';
  import { useDialog, useMessage } from 'naive-ui';
  import type { Component } from 'vue';
  import { NIcon, NPagination } from 'naive-ui';
  import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@vicons/antd';
  import AddPermission from '@/components/Permission/AddPermission.vue';
  import EditPermission from '@/components/Permission/EditPermission.vue';

  const dialog = useDialog();
  const showModal = ref(false);
  const selectedOption: any = ref(null);
  const showEditModal = ref(false);
  const selectedId = ref();
  const message = useMessage();
  const { getList, list, page, pageSizes, itemCount, pageSize, params }: any =
    userPagination(getPermissionsApi);
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
    deletePermissionApi(selectedId.value)
      .then((result) => {
        message.success(result.message);
        getList();
        Loading.finish();
      })
      .catch((result) => {
        message.error(result.message);
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

  const selectedAction = (key: any) => {
    selectedOption.value = key;
  };
  const fetchList = () => {
    getList(params.value);
  };
  onMounted(() => {
    getList();
  });
</script> -->

<!-- <style lang="scss" scoped>
  .data_placeholder {
    text-align: center;
    color: gray;
    padding: 20px 0;
    font-size: 18px;
    font-style: italic;
  }
</style> -->
