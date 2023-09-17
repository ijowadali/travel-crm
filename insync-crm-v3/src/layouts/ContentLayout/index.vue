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
        height: '100%'
      }"
    >
      <slot name="contentHeader"></slot>
      <slot></slot>
    </NCard>
  </main>
</template>

<style scoped lang="scss"></style>
