<template>
  <el-drawer
    :model-value="show"
    :direction="direction"
    :before-close="handleCancel"
    size="60%"
    @closed="emit('closed')"
    @open="emit('open')"
  >
    <template #header>
      <h4>{{ title }}</h4>
    </template>
    <template #default>
      <div v-loading="allLoading">
        <slot></slot>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleCancel">取消</el-button>
        <el-button v-if="isOk" type="primary" @click="emit('ok')" :loading="loading">确认</el-button>
        <slot name="footerBtn"></slot>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean
    title: string
    direction?: any
    loading?: boolean
    allLoading?: boolean
    isOk?: boolean
  }>(),
  {
    show: false,
    direction: "rtl",
    title: "",
    loading: false,
    allLoading: false,
    isOk: true
  }
)

const emit = defineEmits(["update:show", "closed", "ok", "open"])

const handleCancel = () => {
  emit("update:show", false)
}
</script>
<style lang="scss" scoped></style>
