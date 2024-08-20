<template>
  <el-dialog
    :model-value="show"
    :title="title"
    :before-close="handleCancel"
    @closed="emit('closed')"
    :width="width"
    @open="emit('open')"
  >
    <slot></slot>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" v-if="isOk" @click="emit('ok')" :loading="loading">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean
    title: string
    loading?: boolean
    width?: string
    isOk?: boolean
  }>(),
  {
    show: false,
    title: "",
    loading: false,
    width: "30%",
    isOk: true
  }
)
const emit = defineEmits(["update:show", "closed", "ok", "open"])
const handleCancel = () => {
  emit("update:show", false)
}
</script>

<style lang="scss" scoped></style>
