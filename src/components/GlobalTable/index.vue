<template>
  <el-table
    style="width: 100%"
    stripe
    highlight-current-row
    :data="data"
    :max-height="tableHeight"
    v-loading="loading"
    v-bind="$attrs"
    @selection-change="handleSelectionChange"
    @current-change="handleCurrentChange"
  >
    <el-table-column v-if="isShowSelect" fixed type="selection" width="50" align="center" />
    <el-table-column fixed width="70" type="index" label="序号" :index="indexMethod" />
    <slot></slot>
  </el-table>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    data?: Array<any>
    tableHeight: number
    loading?: boolean
    isShowSelect?: boolean
    handleSelectionChange?: (selection: any[]) => void
  }>(),
  {
    data: [] as any,
    tableHeight: 300,
    loading: false,
    isShowSelect: true,
    handleSelectionChange: () => {}
  }
)

const indexMethod = (index: number) => {
  return index + 1
}

interface User {
  date: string
  name: string
  address: string
}

const emit = defineEmits(["currentChange"])

const handleCurrentChange = (val: User | undefined) => {
  emit("currentChange", val)
}
</script>

<style lang="scss" scoped></style>
