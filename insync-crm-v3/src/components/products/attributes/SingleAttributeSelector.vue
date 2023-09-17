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
    :loading="attributesLoading"
    :options="filteredAttributes"
    @search="filterAttributes"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAttribute } from '@src/hooks/useAttribute';

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array, Object, Number, Boolean]
    },
    labelField: {
      type: String,
      default: 'name'
    },
    placeholder: {
      type: String,
      default: 'Search Attributes'
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
    const { filterAttributes, filteredAttributes, attributesLoading } = useAttribute(props.tag);
    const selectValue = ref(null);
    return {
      filterAttributes,
      filteredAttributes,
      attributesLoading,
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
