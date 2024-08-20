<template>
  <el-input
    :model-value="value"
    @input="handleChange"
    :placeholder="placeholder"
    clearable
    :style="currentStyle"
    :type="type"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: string
    placeholder?: string
    style?: Object
    line?: boolean
    type?: string
    disabled?: boolean
  }>(),
  {
    value: "",
    placeholder: "请输入",
    style: () => ({}),
    type: "text",
    disabled: false,
    line: false
  }
)
const currentStyle = computed(() => {
  return {
    width: props.line ? "100%" : "192px",
    ...props.style
  }
})
// style
const emit = defineEmits(["update:value"])
const handleChange = (val: any) => {
  emit("update:value", val)
}
</script>

<style lang="scss" scoped></style>
