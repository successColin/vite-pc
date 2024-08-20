<template>
  <el-card style="margin-top: 10px" shadow="never">
    <template #header>
      <div class="card-header">
        <span>{{ item.process_name }}</span>
      </div>
    </template>
    <el-descriptions>
      <el-descriptions-item label="审批人:">{{ item.cloud_name }}</el-descriptions-item>
      <el-descriptions-item label="审批结果:">{{ item.opinion }}</el-descriptions-item>
      <el-descriptions-item label="审批时间:">{{ item.finish_time }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    item: any
  }>(),
  {
    item: () => [{}]
  }
)
</script>

<style lang="scss" scoped>
::v-deep(.el-card__header) {
  padding: 10px;
}
::v-deep(.el-card__body) {
  padding: 10px 10px 0;
}
::v-deep(.el-card__header) {
  font-weight: 600;
}
</style>
