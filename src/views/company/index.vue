<template>
  <n-card title="Companies">
    <n-space :vertical="true">
      <!--      <n-input-->
      <!--        type="text"-->
      <!--        size="small"-->
      <!--        v-model:value="params.name"-->
      <!--        @change="fetchList"-->
      <!--        placeholder="Search by Name"-->
      <!--      />-->
      <n-table :bordered="true" :single-line="false" :striped="true" size="small">
        <thead>
          <tr>
            <th>S.no #</th>
            <th>Name</th>
            <th>Logo</th>
            <th>User</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="list.length === 0">
            <td class="data_placeholder" colspan="7"> Record Not Exist</td>
          </tr>
          <tr v-for="item in list" v-else :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.company_name }}</td>
            <td>
              <n-avatar :src="`${imgUrl}${item.logo}`" round size="large" />
            </td>
            <td>{{ item.user_id }}</td>
            <td> {{ item.phone }}</td>
            <td>{{ item.address + ' ' + item.city + ' ' + item.state + ' ' + item.country }}</td>
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
      <n-button
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
          <div>Create New Company</div>
        </template>
        <n-space :vertical="true">
          <add-company
            @created="
              getList();
              showModal = false;
            "
          />
        </n-space>
      </n-modal>

      <n-modal v-model:show="showEditModal" preset="dialog" style="width: 70%">
        <template #header>
          <div>Update Company</div>
        </template>
        <n-space :vertical="true">
          <edit-company
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
</template>

<script lang="ts" setup>
  import { deleteCompanyApi, getCompaniesApi } from '@/api/company/company';
  import { userPagination } from '@/hooks/userPagination';
  import type { Component } from 'vue';
  import { h, onMounted, ref } from 'vue';
  import { NIcon, NPagination, useDialog } from 'naive-ui';
  import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@vicons/antd';
  import EditCompany from '@/components/company/EditCompany.vue';
  import AddCompany from '@/components/company/AddCompany.vue';
  import { useGlobSetting } from '@/hooks/setting';

  const globSetting = useGlobSetting();
  const { imgUrl } = globSetting;
  const dialog = useDialog();
  const selectedOption: any = ref(null);
  const showModal = ref(false);
  const showEditModal = ref(false);
  const selectedId = ref();
  const loading = ref(false);
  const { getList, list, page, pageSizes, itemCount, pageSize, params }: any =
    userPagination(getCompaniesApi);
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
    loading.value = true;
    deleteCompanyApi(selectedId.value)
      .then(async (result) => {
        window['$message'].success(result.message);
        await getList();
        loading.value = false;
        dialog.destroyAll;
      })
      .catch((result) => {
        window['$message'].error(result.message);
        loading.value = false;
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
  onMounted(async () => {
    await getList(params.value);
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
