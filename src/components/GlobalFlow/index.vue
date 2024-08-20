<template>
  <el-steps
    v-if="flowArr.length"
    :style="currentStyle"
    :active="flowActive"
    finish-status="success"
    process-status="process"
    align-center
  >
    <el-step v-for="(v, i) in flowArr" :key="i" :title="v.process_name" />
  </el-steps>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    style?: Object
    flowArr: Array<any>
    flowActive: number
  }>(),
  {
    style: () => ({}),
    flowArr: () => [],
    flowActive: 0
  }
)

const currentStyle = computed(() => {
  return {
    marginBottom: "20px",
    ...props.style
  }
})
</script>

<style lang="scss" scoped></style>
