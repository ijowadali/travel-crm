<template>
  <n-form ref="formRef" :label-width="80" :model="rooms" :rules="rules" size="small">
    <n-row :gutter="10">
      <n-col :span="12">
        <n-form-item label="Room Type" path="room_type">
          <n-select
            v-model:value="rooms.room_type"
            filterable
            placeholder="Select Option"
            :options="[
              { label: 'Double Bed', value: 'double bed' },
              { label: 'Triple Bed', value: 'triple bed' },
              { label: 'Quad Bed', value: 'quad bed' },
              { label: 'Quint Bed', value: 'quint bed' },
              { label: 'Six Bed', value: 'six bed' },
            ]"
          />
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item label="Room No" path="room_no">
          <n-input v-model:value="rooms.room_no" placeholder="Enter Room No" />
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item label="Room Status" path="is_active">
          <n-switch v-model:value="rooms.is_active" :checked-value="1" :unchecked-value="0" />
        </n-form-item>
      </n-col>
    </n-row>
    <n-row :gutter="10">
      <n-col :span="12">
        <n-form-item label="Floor" path="floor_no">
          <n-input v-model:value="rooms.floor_no" placeholder="Enter Floor" />
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item label="Price Type" path="price_type">
          <n-input v-model:value="rooms.price_type" placeholder="Enter Price Type" />
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item label="Purchase Price" path="purchase_price">
          <n-input v-model:value="rooms.purchase_price" placeholder="Enter Purchase Price" />
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item label="Sale Price" path="sale_price">
          <n-input v-model:value="rooms.sale_price" placeholder="Enter Sale Price" />
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item label="No of Bed" path="no_of_bed">
          <n-input-number v-model:value="rooms.no_of_bed" clearable />
        </n-form-item>
      </n-col>
    </n-row>
    <n-space justify="end" :wrap="true" :size="0">
      <n-form-item
        :theme-overrides="{
          feedbackHeightSmall: '0',
          feedbackHeightMedium: '0',
          labelHeightMedium: '0',
        }"
      >
        <n-button type="success" @click="handleValidateClick">Update</n-button>
      </n-form-item>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInst } from 'naive-ui';
  import { updateRoomApi, getRoomApi } from '@/api/hotel/room/rooms';

  const formRef = ref<FormInst | null>(null);
  const rooms: any = ref({});
  const emits = defineEmits(['updated']);
  const props = defineProps({
    id: {
      type: Number,
    },
  });
  // get category for update
  getRoomApi(props.id).then((result: any) => (rooms.value = result));

  const rules = ref({
    name: {
      required: true,
      message: 'Please Enter Name',
      trigger: 'blur',
    },
  });

  const handleValidateClick = (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
      if (!errors) {
        updateRoomApi(rooms.value.id, rooms.value).then((result: any) => {
          window['$message'].success(result.message);
          emits('updated', result);
        });
      } else {
        console.log(errors);
        window['$message'].error('Invalid');
      }
    });
  };
</script>

<style lang="less" scoped></style>
