<template>
  <div class="app-container contentBoxGlobal" ref="contentBoxRef">
    <div ref="searchBoxRef">
      <el-card shadow="never" class="search-wrapper">
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="title" label="公告标题">
            <global-input v-model:value="searchData.title" placeholder="请输入公告标题"></global-input>
          </el-form-item>
          <el-form-item prop="publisher" label="创建人">
            <global-input v-model:value="searchData.publisher" placeholder="请输入创建人"></global-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增工单</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <global-table v-bind="tableParams">
          <component
            v-for="item in columnArr"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :is="item.component"
            :buttonArr="item.buttonArr"
            :width="item.width"
            :switchFun="item.switchFun"
            @changeSwitch="changeSwitch"
            @handleUpdate="handleUpdate"
            @handleView="handleView"
            @handleRead="handleRead"
          ></component>
        </global-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <notice-drawer v-model:show="drawerVisible" :currentObj="currentObj" @refresh="getTableData"></notice-drawer>
    <notice-view v-model:show="viewVisible" :currentObj="currentObj" @refresh="getTableData"></notice-view>
    <notice-read v-model:show="readVisible" :currentId="currentId"></notice-read>
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance, ElMessage } from "element-plus"
import noticeDrawer from "./components/noticeDrawer.vue"
import noticeRead from "./components/noticeRead.vue"
import noticeView from "./components/noticeView.vue"

// 表格列参数
const columnArr = [
  {
    prop: "title",
    label: "公告标题",
    component: "GlobalColumn"
  },
  {
    prop: "created_at",
    label: "创建时间",
    component: "GlobalColumn"
  },
  {
    prop: "publisher",
    label: "创建人",
    component: "GlobalColumn"
  },
  {
    prop: "status",
    label: "状态",
    component: "GlobalColumnSwitch",
    switchFun: "changeSwitch"
  },
  {
    prop: "name",
    label: "操作",
    component: "GlobalColumnBtn",
    width: 250,
    buttonArr: [
      {
        type: "primary",
        label: "修改",
        funcName: "handleUpdate"
      },
      {
        type: "success",
        label: "查看",
        funcName: "handleView"
      },
      {
        type: "warning",
        label: "阅读情况",
        funcName: "handleRead"
      }
    ]
  }
]

//#region 查删
import { detailNoticeList, editChangeStatus, getNoticeList } from "@/api/notice"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  title: "",
  publisher: ""
})
const contentBoxRef = ref<HTMLDivElement | null>()
const searchBoxRef = ref<HTMLDivElement | null>()
const {
  height,
  loading,
  tableData,
  getTableData,
  handleSearch,
  handleSelectionChange
  // work
} = useTable(contentBoxRef, searchBoxRef, getNoticeList, getNoticeList, paginationData, searchData)
// 表格参数
const tableHeight = computed(() => Number(height.value) - 40)
const tableParams = reactive({
  data: tableData,
  tableHeight,
  loading,
  handleSelectionChange
})
//#endregion

// #region 重置
const searchFormRef = ref<FormInstance | null>(null)
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
// #endregion

// #region 开关
const changeSwitch = async (row: any) => {
  console.log(row)
  await editChangeStatus({ id: row.id, status: row.status })
  ElMessage.success("修改成功")
  handleSearch()
}
// #endregion

// #region 新增
const handleAdd = async (row: any) => {
  currentObj.value = []
  drawerVisible.value = true
}
// #endregion

// #region 修改
const drawerVisible = ref<boolean>(false)
const currentObj = ref<Object>({})
const handleUpdate = async (row: any) => {
  await getDetails(row)
  drawerVisible.value = true
}
// #endregion

// #region 查看
const viewVisible = ref<boolean>(false)
const handleView = async (row: any) => {
  await getDetails(row)
  viewVisible.value = true
}
// #endregion

// #region 阅读情况
const readVisible = ref<boolean>(false)
const currentId = ref<string>("")
const handleRead = async (row: any) => {
  currentId.value = String(row.id)
  readVisible.value = true
}
// #endregion

const getDetails = async (row: any) => {
  const { data } = await detailNoticeList({ id: row.id })
  currentObj.value = data
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="scss" scoped></style>
