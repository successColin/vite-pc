<template>
  <div class="app-container contentBoxGlobal" ref="contentBoxRef">
    <div ref="searchBoxRef">
      <el-card shadow="never" class="search-wrapper">
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="order_no" label="报修单号">
            <global-input v-model:value="searchData.order_no" placeholder="请输入报修单号"></global-input>
          </el-form-item>
          <el-form-item prop="procure_no" label="采购单号">
            <global-input v-model:value="searchData.procure_no" placeholder="请输入采购单号"></global-input>
          </el-form-item>
          <el-form-item prop="status" label="采购单状态">
            <global-select
              v-model:value="searchData.status"
              :option="purchaseStates"
              placeholder="请选择采购单状态"
            ></global-select>
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
            @handleRemove="handleRemove"
            @handleView="handleView"
            @handleOrderDetail="handleOrderDetail"
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
      @refresh="getTableData"
    ></apply-drawer>

    <order-view
      v-model:show="viewVisible"
      :title="viewTitle"
      :showItem="showItem"
      :activeNames="activeNames"
      :currentObj="currentObj"
      :viewType="viewType"
      @refresh="getTableData"
    ></order-view>
  </div>
</template>

<script setup lang="ts">
import { purchaseStates } from "@/config/dictionary"
import orderView from "@/views/repair/components/orderView.vue"
import { CirclePlus, Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance, ElMessage } from "element-plus"
import applyDrawer from "./components/applyDrawer.vue"
// E:\mycode\repair\src\views\repair\components\orderView.vue

// 表格列参数
const columnArr = [
  {
    prop: "procure_no",
    label: "采购单号",
    component: "GlobalColumn",
    width: 210
  },
  {
    prop: "order_no",
    label: "报修单号",
    component: "GlobalColumn",
    width: 200
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
    prop: "desc",
    label: "申请说明",
    component: "GlobalColumn",
    width: 200
  },
  {
    prop: "approval_status_text",
    label: "采购单状态",
    component: "GlobalColumn",
    width: 100
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
    width: 250,
    buttonArr: [
      {
        type: "primary",
        label: "撤回",
        funcName: "handleRemove",
        isShow: [
          {
            prop: "step",
            value: "1",
            type1: "==",
            prop1: "status",
            value1: 0
          }
        ]
      },
      {
        type: "success",
        label: "查看详情",
        funcName: "handleView"
      },
      {
        type: "success",
        label: "查看工单",
        funcName: "handleOrderDetail",
        isShow: [
          {
            prop: "order_no",
            noEqualvalue: ""
          }
        ]
      }
    ]
  }
]

//#region 查删
import { getProcureList, revocationProcure } from "@/api/purchase"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  order_no: "",
  procure_no: "",
  status: ""
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

// 撤回
import { useBottom } from "@/hooks/useBottom"
const { uConfirm } = useBottom()
const handleRemove = async (row: any) => {
  uConfirm("撤回该条数据", async () => {
    await revocationProcure({
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
const readOnly = ref<boolean>(false)
const drawerVisible = ref<boolean>(false)

// 新增
const addApply = () => {
  currentObj.value = {}
  readOnly.value = false
  drawerVisible.value = true
}

// 表单详情
const handleView = async (row: any) => {
  // const { data } = await detailSetOrder({ id: row.id })
  currentObj.value = row
  readOnly.value = true
  drawerVisible.value = true
}

// 工单详情
import { detailSetOrder } from "@/api/repair"
const viewType = ref<number>()
const activeNames = ref([1])
const showItem = ref<number[]>()
const viewTitle = ref<string>()
const viewVisible = ref<boolean>(false)
const handleOrderDetail = async (row: any) => {
  const { data } = await detailSetOrder({ id: row.id })
  currentObj.value = data
  viewType.value = undefined
  activeNames.value = [1]
  showItem.value = [1, 2, 3, 4, 5, 6]
  viewTitle.value = "查看"
  viewVisible.value = true
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>
