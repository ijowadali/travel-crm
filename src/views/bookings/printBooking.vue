<template>
  <n-card title="Print Booking">
    <n-row :gutter="10">
      <n-col :span="8">First Company info</n-col>
      <n-col :span="8">Second Company Info</n-col>
      <n-col :span="8">Third Company Info</n-col>
    </n-row>
  </n-card>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { getBookingApi } from '@/api/booking/booking';

  const route = useRoute();
  const printData = ref({});
  console.log(printData);
  onMounted(async () => {
    console.log(route.query.booking_id);
    await getBookingApi(parseInt(String(route.query.booking_id))).then((result) => {
      printData.value = result;
    });
  });
</script>
<style lang="less"></style>
