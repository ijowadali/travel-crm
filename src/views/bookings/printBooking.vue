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
import { getRecordApi } from '@src/api/endpoints';

const route = useRoute();
const printData = ref({});
console.log(printData);
onMounted(async () => {
  console.log(route.query.booking_id);
  await getRecordApi('/bookings/' + route.query.booking_id).then((res: any) => {
    printData.value = res.result;
  });
});
</script>

<style lang="scss"></style>
