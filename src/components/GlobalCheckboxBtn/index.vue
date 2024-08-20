<template>
  <el-checkbox-group :model-value="value" :disabled="disabled" :style="style" @change="handleChange">
    <el-checkbox-button v-for="item in option" :key="item.value" :label="item.label" :value="item.value" />
  </el-checkbox-group>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value: Array<any>
    option: Array<{ value: string | number; label: string }>
    style?: string
    disabled?: boolean
  }>(),
  {
    value: () => [],
    style: "192px",
    option: () => [],
    disabled: false
  }
)
const emit = defineEmits(["update:value", "change"])
const handleChange = (val: any) => {
  console.log(val)
  emit("update:value", val)
  emit("change", val)
}
</script>

<style lang="scss" scoped></style>
