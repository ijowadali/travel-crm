<template>
  <main class="flex h-[calc(100%-144px)] flex-col">
    <NCard
      class="!flex h-full"
      hoverable
      :content-style="{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        padding: '16px',
        overflow: 'scroll'
      }"
    >
      <div class="mb-2 sm:mb-3">
        <NCard
          embedded
          :content-style="{
            padding: '12px',
            overflow: 'hidden'
          }"
        >
          <slot name="tableHeader"></slot>
        </NCard>
      </div>
      <!-- #efeff5 -->
      <div class="table_content_container">
        <slot name="tableContent"></slot>
      </div>
      <slot></slot>
      <div class="mt-2 sm:mt-3">
        <NCard
          embedded
          :content-style="{
            padding: '12px',
            overflow: 'hidden'
          }"
        >
          <slot name="tableFooter"></slot>
        </NCard>
      </div>
    </NCard>
  </main>
</template>

<style scoped lang="scss">
:deep(.n-data-table) {
  flex-grow: 1 !important;
}
.table_content_container {
  @apply relative overflow-x-auto sm:rounded-lg border border-gray-200 dark:border-gray-800;
}
</style>
