<template>
  <div class="app-container contentBoxGlobal" ref="contentBoxRef">
    <div ref="searchBoxRef">
      <el-card shadow="never" class="search-wrapper">
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="order_no" label="报修单号">
            <global-input v-model:value="searchData.order_no" placeholder="请输入报修单号"></global-input>
          </el-form-item>
          <el-form-item prop="project_unit_name" label="维修单位">
            <global-input v-model:value="searchData.project_unit_name" placeholder="请输入维修单位"></global-input>
          </el-form-item>
          <el-form-item prop="category_name" label="维修类目">
            <global-input v-model:value="searchData.category_name" placeholder="请输入维修类目"></global-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <global-table-tabs v-bind="tableTabsParams" @tabClick="handleTabClick">
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
              :switchVal="item.switchVal"
              @handleView="handleView"
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
    </global-table-tabs>

    <submit-drawer v-model:show="drawerVisible" :currentObj="currentObj" @refresh="getTableData"></submit-drawer>
  </div>
</template>

<script setup lang="ts">
import { IsUrgentType, moneyType } from "@/config/dictionary"
import { Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance } from "element-plus"
import submitDrawer from "./components/submitDrawer.vue"

const tableTabsParams = reactive({
  activeName: "1",
  tabsArr: [
    {
      label: "进行中",
      name: "1"
    },
    {
      label: "已完成",
      name: "2"
    }
  ]
})
const handleTabClick = (tabName: string) => {
  if (tabName === "1") {
    searchData.type = 1
  } else if (tabName === "2") {
    searchData.type = 2
  }
  handleSearch()
}

// 表格列参数
const columnArr = [
  {
    prop: "order_no",
    label: "报修单号",
    component: "GlobalColumn",
    width: 200
  },
  {
    prop: "type",
    label: "款项类别",
    component: "GlobalColumn",
    switchVal: moneyType
  },
  {
    prop: "pay_amount",
    label: "金额",
    component: "GlobalColumn"
  },
  {
    prop: "project_unit_name",
    label: "维修单位",
    component: "GlobalColumn"
  },
  {
    prop: "category_name",
    label: "维修类目",
    component: "GlobalColumn"
  },
  {
    prop: "is_urgent",
    label: "紧急程度",
    component: "GlobalColumn",
    switchVal: IsUrgentType
  },
  {
    prop: "pay_apply_time",
    label: "申请时间",
    component: "GlobalColumn",
    width: 170
  },
  {
    prop: "pay_auth_status_text",
    label: "状态",
    component: "GlobalColumn"
  },
  {
    prop: "creator",
    label: "提交人",
    component: "GlobalColumn"
  },
  {
    prop: "name",
    label: "操作",
    component: "GlobalColumnBtn",
    width: 200,
    buttonArr: [
      {
        type: "primary",
        label: "提交",
        funcName: "handleView"
      }
    ]
  }
]

//#region 查删
import { getRepairPayPaymentList } from "@/api/outRepair"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  type: 1,
  order_no: "",
  project_unit_name: "",
  category_name: ""
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
} = useTable(contentBoxRef, searchBoxRef, getRepairPayPaymentList, getRepairPayPaymentList, paginationData, searchData)
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
const currentObj = ref<any>()
const drawerVisible = ref<boolean>(false)
const handleView = async (row: any) => {
  // const { data } = await detailSetOrder({ id: row.id })
  currentObj.value = row
  drawerVisible.value = true
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>
