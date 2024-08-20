<template>
  <el-radio-group :model-value="value" :style="style" :disabled="disabled" @change="handleChange">
    <el-radio-button v-for="item in option" :key="item.value" :label="item.label" :value="item.value" />
  </el-radio-group>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value: string | number
    option: Array<{ value: string | number; label: string }>
    style?: string
    disabled?: boolean
  }>(),
  {
    value: "",
    style: "192px",
    option: () => [],
    disabled: false
  }
)
const emit = defineEmits(["update:value", "change"])
const handleChange = (val: any) => {
  emit("update:value", val)
  emit("change", val)
}
</script>

<style lang="scss" scoped></style>
