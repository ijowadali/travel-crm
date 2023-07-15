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
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  onMounted(() => {
    console.log(route.query.booking_id);
  });
</script>
<style lang="less"></style>
