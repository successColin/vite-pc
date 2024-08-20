<template>
  <el-select
    :disabled="disabled"
    :model-value="value"
    :placeholder="placeholder"
    clearable
    filterable
    :style="currentStyle"
    @change="handleChange"
  >
    <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: string | number
    placeholder?: string
    style?: Object
    line?: boolean
    option: Array<{ value: string | number; label: string }>
    disabled?: boolean
  }>(),
  {
    value: "",
    placeholder: "请选择",
    style: () => ({}),
    option: () => [],
    disabled: false
  }
)

const currentStyle = computed(() => {
  return {
    width: props.line ? "100%" : "192px",
    ...props.style
  }
})

const emit = defineEmits(["update:value", "change"])
const handleChange = (val: any) => {
  emit("update:value", val)
  emit("change", val)
}
</script>

<style lang="scss" scoped></style>
