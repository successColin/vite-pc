<template>
  <div class="app-container contentBoxGlobal" ref="contentBoxRef">
    <div ref="searchBoxRef">
      <el-card shadow="never" class="search-wrapper">
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="procure_no" label="采购单号">
            <global-input v-model:value="searchData.procure_no" placeholder="请输入采购单号"></global-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-card shadow="never">
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
            @handleSubmit="handleSubmit"
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
    <submit-drawer v-model:show="drawerVisible" :currentObj="currentObj" @refresh="getTableData"></submit-drawer>
  </div>
</template>

<script setup lang="ts">
import { Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance } from "element-plus"
import submitDrawer from "./components/submitDrawer.vue"

// 表格列参数
const columnArr = [
  {
    prop: "procure_no",
    label: "采购单号",
    component: "GlobalColumn",
    width: 210
  },
  {
    prop: "amount",
    label: "采购金额",
    component: "GlobalColumn"
  },
  {
    prop: "created_at",
    label: "申请时间",
    component: "GlobalColumn",
    width: 170
  },
  {
    prop: "creator",
    label: "提交人",
    component: "GlobalColumn"
  },
  {
    prop: "approval_status_text",
    label: "状态",
    component: "GlobalColumn"
  },
  {
    prop: "name",
    label: "操作",
    component: "GlobalColumnBtn",
    width: 150,
    buttonArr: [
      {
        type: "primary",
        label: "提交",
        funcName: "handleSubmit"
      }
    ]
  }
]

//#region 查删
import { getProcureList } from "@/api/purchase"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  approval_status: 1,
  pending_approval_node: "cashier",
  procure_no: ""
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
} = useTable(contentBoxRef, searchBoxRef, getProcureList, getProcureList, paginationData, searchData)
// 表格参数
const tableHeight = computed(() => Number(height.value) - 40)
const tableParams = reactive({
  data: tableData,
  tableHeight,
  loading,
  handleSelectionChange
})
// 重置
const searchFormRef = ref<FormInstance | null>(null)
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

// 提交
// import { detailSetOrder } from "@/api/repair"
const currentObj = ref<any>()
const drawerVisible = ref<boolean>(false)
const handleSubmit = async (row: any) => {
  // const { data } = await detailSetOrder({ id: row.id })
  currentObj.value = row
  drawerVisible.value = true
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>
