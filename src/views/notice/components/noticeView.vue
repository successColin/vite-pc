<template>
  <global-drawer :show="show" :isOk="false" title="查看" @update:show="emit('update:show', false)">
    <global-descriptions :column="4" :arr="info1"></global-descriptions>
    <global-descriptions :arr="info2"></global-descriptions>
    <global-descriptions :arr="info3"></global-descriptions>
    <global-descriptions :arr="info4"></global-descriptions>
  </global-drawer>
</template>

<script lang="ts" setup>
import { IsNo, noticeState } from "@/config/dictionary"

const props = withDefaults(
  defineProps<{
    show: boolean
    currentObj: any
  }>(),
  {
    show: false,
    currentObj: {}
  }
)

const info1 = computed(() => {
  const { publisher, status, force_read } = props.currentObj
  return [
    {
      label: "发布人姓名",
      value: publisher
    },
    {
      label: "显示状态",
      value: noticeState.find((v: any) => v.value === status)?.label
    },
    {
      label: "是否强制阅读",
      value: IsNo.find((v: any) => v.value === force_read)?.label
    }
  ]
})

const info2 = computed(() => {
  const { student_range_text, teacher_range_text } = props.currentObj
  let label = "发布范围"
  let value = ""
  if (student_range_text?.length) {
    label = "学生范围"
    value = student_range_text.join("、")
  } else if (teacher_range_text?.length) {
    label = "教师范围"
    value = teacher_range_text.join("、")
  }
  return [
    {
      label,
      value
    }
  ]
})

const info3 = computed(() => {
  return [
    {
      label: "公告详细",
      value: props.currentObj.content,
      type: 3
    }
  ]
})
const info4 = computed(() => {
  return [
    {
      label: "上传文件",
      value: props.currentObj?.file,
      type: 1
    }
  ]
})

const emit = defineEmits(["update:show"])
</script>
