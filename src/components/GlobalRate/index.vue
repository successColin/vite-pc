<template>
  <el-rate
    :disabled="disabled"
    size="large"
    show-text
    :model-value="value"
    @change="handleChange"
    text-color="#ff9900"
    :texts="texts"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value: any
    disabled?: boolean
  }>(),
  {
    value: undefined,
    disabled: false
  }
)

const texts = ["不满意", "较差", "一般", "不错", "超赞"]
const emit = defineEmits(["update:value"])
const handleChange = (val: any) => {
  console.log(val)
  emit("update:value", val)
}
</script>

<style lang="scss" scoped></style>
