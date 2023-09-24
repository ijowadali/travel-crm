<template>
  <n-card>
    <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="small">
      <n-space style="display: block" vertical>
        <n-card style="margin-bottom: 10px" title="Booking Details">
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
                  :options="[
                    { label: 'Draft', value: 'draft' },
                    { label: 'Processing', value: 'processing' },
                    { label: 'Final', value: 'final' }
                  ]"
                  filterable
                  placeholder="Search Status"
                />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Group No" path="group_no">
                <n-input-number v-model:value="formValue.group_no" class="w-full" min="0" />
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
                  :options="[
                    { label: 'Basic', value: 'basic' },
                    { label: 'Individual', value: 'individual' },
                    { label: 'Premium', value: 'premium' },
                    { label: 'VIP', value: 'vip' }
                  ]"
                  filterable
                  placeholder="Search Category"
                />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Approval Date" path="approval_date">
                <n-date-picker
                  v-model:formatted-value="formValue.approval_date"
                  clearable
                  style="width: 100%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="Expected Departure" path="expected_departure">
                <n-date-picker
                  v-model:formatted-value="formValue.expected_departure"
                  clearable
                  style="width: 100%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
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
import { createRecordApi } from '@src/api/endpoints';
import { ref } from 'vue';
import { type FormInst } from 'naive-ui';
// import { generalFormRules } from '@src/rules/booking';

const formRef = ref<FormInst | null>(null);
const formValue: any = ref({});
const loading = ref(false);
// const rules = generalFormRules();

async function saveBooking() {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      console.log(errors);
      window['$message'].error('Please fill out required fields');
    } else {
      loading.value = true;
      const response: any = await createRecordApi('/bookings', { ...formValue.value });
      if (response.status) {
        window['$message'].success(response.message);
      } else {
        window['$message'].error(response.message);
      }
      loading.value = false;
    }
  });
}
</script>
