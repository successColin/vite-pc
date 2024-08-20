<template>
  <global-dialog
    title="发布范围选择"
    width="max-content"
    :show="show"
    @closed="resetForm"
    @ok="handleOk"
    @update:show="emit('update:show', false)"
  >
    <global-table-tabs type v-bind="tableTabsParams" @tabClick="handleTabClick"> </global-table-tabs>
    <el-transfer
      style="margin-top: 20px"
      v-model="value"
      filterable
      :filter-method="filterMethod"
      :titles="['未选', '已选']"
      filter-placeholder="请输入搜索内容"
      :props="{
        key: 'id',
        label: 'name'
      }"
      :data="dataArr"
    />
  </global-dialog>
</template>

<script setup lang="ts">
import { getStudents, getTeachers } from "@/api/home"
import { ElMessage } from "element-plus"

const props = withDefaults(
  defineProps<{
    show: boolean
    scopeVal: Array<any>
    scopeType?: number
  }>(),
  {
    show: false,
    scopeVal: () => [],
    scopeType: 1,
  }
)

const tableTabsParams = reactive({
  activeName: "first",
  tabsArr: [
    {
      label: "学生",
      name: "first"
    },
    {
      label: "老师",
      name: "second"
    }
  ]
})

let dataArr = reactive<any>([])
const initStudets = async () => {
  const { data } = await getStudents({
    status: 1
  })
  dataArr.length = 0
  dataArr.push(...data)
}
const initTeacher = async () => {
  const { data } = await getTeachers({
    status: 1
  })
  dataArr.length = 0
  dataArr.push(...data)
}

// 切换tabs
const value = ref<any>([])
let tabNameVal = ref<string>("first")
const handleTabClick = (tabName: string) => {
  tabNameVal.value = tabName
  value.value = []
  if (tabName === "first") {
    initStudets()
  } else if (tabName === "second") {
    initTeacher()
  }
}

watch(
  () => props.show,
  (v) => {
    console.log(v)
    if (v) {
      value.value = props.scopeVal
    }
  }
)

onMounted(() => {
  if (props.scopeType === 1) {
    initStudets()
    tableTabsParams.activeName = "first"
  } else if (props.scopeType === 2) {
    initTeacher()
    tableTabsParams.activeName = "second"
  }
})

const filterMethod = (query: any, item: any) => {
  if (!query) return true
  return item.name.indexOf(query) !== -1
}

// 方法
const emit = defineEmits(["update:show", "getStudents", "getTeachers"])

// 点击ok
const handleOk = () => {
  if (!value.value.length) {
    return ElMessage.warning("请选择数据")
  }
  console.log(value.value, tabNameVal)
  if (tabNameVal.value === "first") {
    emit("getStudents", value.value)
  } else if (tabNameVal.value === "second") {
    emit("getTeachers", value.value)
  }
  emit("update:show", false)
}

// 关闭弹窗
const resetForm = () => {
  value.value = []
}
</script>

<style lang="scss" scoped></style>
