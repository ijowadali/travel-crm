<template>
  <n-card>
    <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="small">
      <n-space style="display: block" vertical>
        <n-card title="Booking Details" style="margin-bottom: 10px">
          <n-row gutter="12">
            <n-col :span="6">
              <n-form-item label="Customer Name" path="customer_name">
                <n-input
                  v-model:value="formValue.customer_name"
                  placeholder="Enter Customer Name"
                />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Booking Status" path="booking_status">
                <n-select
                  v-model:value="formValue.booking_status"
                  filterable
                  placeholder="Search Status"
                  :options="[
                    { label: 'Draft', value: 'draft' },
                    { label: 'Processing', value: 'processing' },
                    { label: 'Final', value: 'Final' },
                  ]"
                />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Group No" path="group_no">
                <n-input-number class="w-full" v-model:value="formValue.group_no" min="0" />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Group Name" path="group_name">
                <n-input v-model:value="formValue.group_name" placeholder="Enter Group Name" />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Category" path="category">
                <n-select
                  v-model:value="formValue.category"
                  filterable
                  placeholder="Search Category"
                  :options="[
                    { label: 'Basic', value: 'basic' },
                    { label: 'Individual', value: 'individual' },
                    { label: 'Premium', value: 'premium' },
                    { label: 'VIP', value: 'vip' },
                  ]"
                />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Approval Date" path="approval_date">
                <n-date-picker
                  style="width: 100%"
                  v-model:formatted-value="formValue.approval_date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Expected Departure" path="expected_departure">
                <n-date-picker
                  style="width: 100%"
                  v-model:formatted-value="formValue.expected_departure"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Confirmed Ticket" path="confirmed_ticket">
                <n-switch v-model:value="formValue.confirmed_ticket" />
              </n-form-item>
            </n-col>
          </n-row>
        </n-card>
      </n-space>
      <n-space :vertical="true">
        <n-form-item>
          <n-button :loading="loading" type="success" @click="saveBooking">
            Create Booking
          </n-button>
        </n-form-item>
      </n-space>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
  import { createBookingApi } from '@/api/booking/booking';
  import { ref } from 'vue';
  import { FormInst } from 'naive-ui';
  import { generalFormRules } from '@/rules/booking';

  const formRef = ref<FormInst | null>(null);
  const formValue: any = ref({});
  const loading = ref(false);
  const rules = generalFormRules();

  async function saveBooking() {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        loading.value = true;
        const response = await createBookingApi({ ...formValue.value });
        if (response.status) {
          window['$message'].success(response.message);
        } else {
          window['$message'].error(response.message);
        }
        loading.value = false;
      } else {
        console.log(errors);
        window['$message'].error('Please fill out required fields');
      }
    });
  }
</script>
