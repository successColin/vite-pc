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
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="addApply">发起申请</el-button>
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
            :switchVal="item.switchVal"
            @handleRemove="handleRemove"
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
    <apply-drawer
      v-model:show="drawerVisible"
      :readOnly="readOnly"
      :currentObj="currentObj"
      :flowArr="flowArr"
      :flowActive="flowActive"
      :allLoading="allLoading"
      @refresh="getTableData"
    ></apply-drawer>
  </div>
</template>

<script setup lang="ts">
import { IsUrgentType, moneyType } from "@/config/dictionary"
import { CirclePlus, Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance, ElMessage } from "element-plus"
import applyDrawer from "./components/applyDrawer.vue"

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
    prop: "created_at",
    label: "申请时间",
    component: "GlobalColumn",
    width: 170
  },
  {
    prop: "status_text",
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
        label: "撤回",
        funcName: "handleRemove",
        isShow: [
          {
            // prop: "status",
            // value: [1]
            prop: "step",
            value: "1",
            type1: "==",
            prop1: "status",
            value1: 1
          }
        ]
      },
      {
        type: "success",
        label: "查看详情",
        funcName: "handleView"
      }
    ]
  }
]

//#region 查删
import { getRepairPayList, removeRepairPay } from "@/api/outRepair"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
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
} = useTable(contentBoxRef, searchBoxRef, getRepairPayList, getRepairPayList, paginationData, searchData)
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

// 撤回
import { useBottom } from "@/hooks/useBottom"
const { uConfirm } = useBottom()
const handleRemove = async (row: any) => {
  uConfirm("撤回该条数据", async () => {
    await removeRepairPay({
      id: row.id
    })
    ElMessage({
      message: "撤回成功",
      type: "success"
    })
    handleSearch()
  })
}

// 获取详情
// import { detailSetOrder } from "@/api/repair"
const currentObj = ref<any>()
// 新增
const drawerVisible = ref<boolean>(false)
const addApply = () => {
  flowArr.value = []
  flowActive.value = 0
  currentObj.value = {}
  readOnly.value = false
  drawerVisible.value = true
}
// 详情
import { useFlow } from "@/hooks/useFlow"
const { getSetps, flowArr, flowActive } = useFlow()
const allLoading = ref<boolean>(false)
const readOnly = ref<boolean>(false)
const handleView = async (row: any) => {
  allLoading.value = true
  // const { data } = await detailSetOrder({ id: row.id })
  currentObj.value = row
  readOnly.value = true
  drawerVisible.value = true
  const { id } = row
  flowArr.value = []
  flowActive.value = 0
  try {
    await getSetps({
      id,
      type: 3
    })
  } catch (error) {
    console.log(error)
  } finally {
    allLoading.value = false
  }
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>
