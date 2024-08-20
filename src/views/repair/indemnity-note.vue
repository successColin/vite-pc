<template>
  <div class="app-container contentBoxGlobal" ref="contentBoxRef">
    <div ref="searchBoxRef">
      <el-card shadow="never" class="search-wrapper">
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="order_no" label="报修单号">
            <global-input v-model:value="searchData.order_no" placeholder="请输入报修单号"></global-input>
          </el-form-item>
          <el-form-item prop="category_name" label="赔付人姓名">
            <global-input v-model:value="searchData.payer_name" placeholder="请输入赔付人姓名"></global-input>
          </el-form-item>
          <el-form-item prop="category_name" label="赔付人学/工号">
            <global-input v-model:value="searchData.payer_num" placeholder="请输入赔付人学/工号"></global-input>
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
            :otherProp="item.otherProp"
            :label="item.label"
            :is="item.component"
            :buttonArr="item.buttonArr"
            :width="item.width"
            @handleAudit="handleAudit"
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
    <order-view
      v-model:show="viewVisible"
      :title="viewTitle"
      :showItem="showItem"
      :activeNames="activeNames"
      :currentObj="currentObj"
      :viewType="viewType"
      @refresh="getTableData"
    ></order-view>
    <!-- <order-drawer v-model:show="drawerVisible" :currentObj="currentObj" @refresh="getTableData"></order-drawer>
    <order-send v-model:show="sendVisible" :currentId="currentId" @refresh="getTableData"></order-send> -->
  </div>
</template>

<script setup lang="ts">
import { Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance } from "element-plus"
import orderView from "./components/orderView.vue"

// 表格列参数
const columnArr = [
  {
    prop: "order_no",
    label: "报修单号",
    component: "GlobalColumn",
    width: 200
  },
  {
    prop: "pay",
    otherProp: "payer_name",
    label: "赔付人姓名",
    component: "GlobalColumn"
  },
  {
    prop: "pay",
    otherProp: "payer_num",
    label: "赔付人学/工号",
    component: "GlobalColumn"
  },
  {
    prop: "pay",
    otherProp: "payer_phone",
    label: "赔付人电话",
    component: "GlobalColumn"
  },
  {
    prop: "status_text",
    label: "赔付状态",
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
        label: "审核",
        funcName: "handleAudit",
        isShow: [
          {
            prop: "status",
            value: [0]
          }
        ]
      },
      {
        type: "success",
        label: "查看",
        funcName: "handleView"
      }
    ]
  }
]

//#region 查删
import { deleSetOrder, detailSetOrder, getPayList } from "@/api/repair"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  order_no: "",
  payer_name: "",
  payer_num: ""
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
} = useTable(contentBoxRef, searchBoxRef, getPayList, deleSetOrder, paginationData, searchData)
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

// 获取详情
const currentObj = ref<any>()
const getDetailOrder = async (id: number) => {
  const { data } = await detailSetOrder({ id })
  currentObj.value = data
}

// 赔付
const viewVisible = ref<boolean>(false)
const activeNames = ref([1])
const showItem = ref<number[]>()
const viewType = ref<number>()
const viewTitle = ref<string>()
const handleAudit = async (row: any) => {
  getDetailOrder(row.order_id)
  activeNames.value = []
  showItem.value = [1, 2, 3, 4, 5]
  viewType.value = 5
  viewTitle.value = "审核"
  viewVisible.value = true
}

// 详情
const handleView = async (row: any) => {
  getDetailOrder(row.order_id)
  viewType.value = undefined
  activeNames.value = [6]
  showItem.value = [1, 2, 3, 4, 5, 6]
  viewTitle.value = "查看"
  viewVisible.value = true
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="scss" scoped></style>
