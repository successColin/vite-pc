<template>
  <el-table-column v-bind="$attrs" :label="label">
    <template #default="scope">
      <el-switch
        v-model="scope.row[prop]"
        :active-value="activeValue"
        :inactive-value="inactiveValue"
        style="--el-switch-on-color: #13ce66"
        @change="$emit(switchFun, scope.row)"
      />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    prop: string
    activeValue?: number
    inactiveValue?: number
    switchFun?: string
  }>(),
  {
    label: "",
    prop: "",
    activeValue: 1,
    inactiveValue: 0,
    switchFun: ""
  }
)
</script>

<style lang="scss" scoped></style>
