<template>
  <n-select
    :filterable="true"
    :tag="tag"
    :placeholder="placeholder"
    :on-update:value="onChangeValue"
    v-model:value="selectValue"
    :clearable="clearable"
    :remote="true"
    :clear-filter-after-select="false"
    :label-field="labelField"
    :value-field="valueField"
    :loading="categoriesLoading"
    :options="filteredCategories"
    @search="filterCategories"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useShop } from '@src/hooks/useShop';

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array, Object, Number, Boolean]
    },
    labelField: {
      type: String,
      default: 'shop_name'
    },
    placeholder: {
      type: String,
      default: 'Search Shop'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    tag: {
      type: Boolean,
      default: false
    },
    valueField: {
      type: String,
      default: 'id'
    }
  },
  emits: ['update:modelValue'],
  setup(props) {
    const { filterCategories, filteredCategories, categoriesLoading } = useShop(props.tag);
    const selectValue = ref(null);
    return {
      filterCategories,
      filteredCategories,
      categoriesLoading,
      selectValue
    };
  },
  watch: {
    modelValue: function (value) {
      this.selectValue = value;
    }
  },
  methods: {
    onChangeValue(value: any) {
      this.$emit('update:modelValue', value);
    }
  }
});
</script>
