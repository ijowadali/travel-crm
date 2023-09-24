<template>
  <n-card class="flex w-full mb-1">
    <n-form ref="formRef" :label-width="80" :model="assignHotel" :rules="rules">
      <n-row gutter="12">
        <n-col :span="6">
          <n-form-item label="Hotel City" path="city">
            <n-select
              v-model:value="assignHotel.city"
              placeholder="Select City"
              @update:value="findCityHotel(assignHotel.city)"
              :options="[
                { label: 'Madina', value: 'madina' },
                { label: 'Makkah', value: 'makkah' }
              ]"
            />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="Hotel" path="hotel_id">
            <n-select
              :filterable="true"
              :tag="false"
              placeholder="Select Hotel"
              v-model:value="assignHotel.hotel_id"
              clearable
              :remote="true"
              label-field="name"
              value-field="id"
              :loading="hotelLoading"
              :options="hotels"
            />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="Room Type" path="room_type">
            <n-select
              v-model:value="assignHotel.room_type"
              filterable
              placeholder="Select Room Type"
              @update:value="findRoomByHotel(assignHotel.hotel_id, assignHotel.room_type, 'active')"
              :options="[
                { label: 'Double Bed', value: 'double bed' },
                { label: 'Quad Bed', value: 'quad bed' },
                { label: 'Quint Bed', value: 'quint bed' },
                { label: 'Sharing', value: 'sharing' },
                { label: 'Six Bed', value: 'six bed' },
                { label: 'Triple Bed', value: 'triple bed' }
              ]"
            />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="Room No" path="room_no">
            <n-select
              :filterable="true"
              :tag="false"
              placeholder="Select Room"
              v-model:value="assignHotel.room_id"
              @update:value="findBedByRoom(assignHotel.room_id, 'available')"
              clearable
              :remote="true"
              label-field="room_no"
              value-field="id"
              :loading="roomLoading"
              :options="rooms"
            />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="Bed No" path="bed_id">
            <n-select
              :filterable="true"
              :tag="false"
              placeholder="Select Bed"
              v-model:value="assignHotel.bed_id"
              clearable
              :remote="true"
              label-field="name"
              value-field="id"
              :loading="bedLoading"
              :options="beds"
            />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="Nights" path="nights">
            <n-input-number class="w-full" v-model:value="assignHotel.nights" min="0" />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="CheckIn Date" path="checkIn_date">
            <n-date-picker
              style="width: 100%"
              v-model:formatted-value="assignHotel.check_in_date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              clearable
            />
          </n-form-item>
        </n-col>
        <n-col :span="6">
          <n-form-item label="CheckOut Date" path="checkOut_date">
            <n-date-picker
              style="width: 100%"
              v-model:formatted-value="assignHotel.check_out_date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              clearable
            />
          </n-form-item>
        </n-col>
      </n-row>
      <n-form-item
        :theme-overrides="{
          feedbackHeightSmall: '0',
          feedbackHeightMedium: '0',
          labelHeightMedium: '0'
        }"
      >
        <n-button :loading="loading" type="success" @click="handleValidateClick">
          <template #icon>
            <n-icon>
              <SaveArrowRight20Filled />
            </n-icon>
          </template>
          Save Hotel
        </n-button>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { type FormInst } from 'naive-ui';
import { usefilterHotel } from '@src/filters/hotels';
import { usefilterRoom } from '@src/filters/rooms';
import { usefilterBed } from '@src/filters/beds';
import { SaveArrowRight20Filled } from '@vicons/fluent';
import { updateRecordApi } from '@src/api/endpoints';

const formRef = ref<FormInst | null>(null);
const assignHotel: any = ref({});
const loading = ref(false);
const emits = defineEmits(['updated']);
const { hotels, hotelLoading, findCityHotel } = usefilterHotel();
const { rooms, roomLoading, findRoomByHotel } = usefilterRoom();
const { beds, bedLoading, findBedByRoom } = usefilterBed();
const props = defineProps({
  id: {
    type: Number
  },
  hotelData: {
    type: Object,
    default: () => ({})
  }
});

watchEffect(async () => {
  if (props.hotelData) {
    await findCityHotel(props.hotelData.city);
    await findRoomByHotel(props.hotelData.hotel_id, props.hotelData.room_type, 'active');
    await findBedByRoom(props.hotelData.room_id, 'available');
    assignHotel.value = { ...props.hotelData };
  }
});

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      updateRecordApi(`/bookings/${props.id}`, { ...assignHotel.value, type: 'hotel' }).then(
        (res: any) => {
          window['$message'].success(res.message);
          emits('updated');
        }
      );
    } else {
      console.log(errors);
      window['$message'].error('Please fill out required fields');
    }
  });
};

const rules = ref({
  name: {
    required: true,
    message: 'Please Enter name',
    trigger: 'blur'
  },
  phone_number: {
    required: true,
    message: 'Please Select phone number',
    trigger: 'blur'
  },
  owner: {
    required: true,
    message: 'Please Enter owner name',
    trigger: 'blur'
  },
  owner_phone: {
    required: true,
    message: 'Please Enter owner phone number',
    trigger: 'blur'
  },
  address: {
    required: true,
    message: 'Please Enter street no',
    trigger: 'blur'
  },
  city: {
    required: true,
    message: 'Please Enter city',
    trigger: 'blur'
  },
  state: {
    required: true,
    message: 'Please Enter state',
    trigger: 'blur'
  },
  country: {
    required: true,
    message: 'Please Enter country',
    trigger: 'blur'
  }
});
</script>

<style lang="less" scoped></style>
