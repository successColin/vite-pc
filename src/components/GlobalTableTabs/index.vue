<template>
  <el-tabs :model-value="activeName" v-bind="$attrs" :type="type" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane v-for="(v, i) in tabsArr" :key="i" :label="v.label" :name="v.name">
      <slot></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from "element-plus"

const props = withDefaults(
  defineProps<{
    activeName: string
    tabsArr: Array<{ label: string; name: string }>
    type?: string
  }>(),
  {
    activeName: "",
    tabsArr: () => [],
    type: "card"
  }
)
const emit = defineEmits(["update:activeName", "tabClick"])
const handleClick = (tab: TabsPaneContext) => {
  emit("update:activeName", tab.paneName)
  emit("tabClick", tab.paneName)
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs__header) {
  margin: 0;
  border-bottom: 0;
}
</style>
