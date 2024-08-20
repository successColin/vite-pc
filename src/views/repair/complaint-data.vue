<template>
  <div class="app-container contentBoxGlobal" ref="contentBoxRef">
    <div ref="searchBoxRef">
      <el-card shadow="never" class="search-wrapper">
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="order_no" label="报修单号">
            <global-input v-model:value="searchData.order_no" placeholder="请输入报修单号"></global-input>
          </el-form-item>
          <el-form-item prop="category_name" label="报修类目">
            <global-input v-model:value="searchData.category_name" placeholder="请输入报修类目"></global-input>
          </el-form-item>
          <el-form-item prop="contact_name" label="报修人">
            <global-input v-model:value="searchData.contact_name" placeholder="请输入报修人"></global-input>
          </el-form-item>
          <el-form-item prop="contacts_info" label="报修人电话">
            <global-input v-model:value="searchData.contacts_info" placeholder="请输入报修人电话"></global-input>
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
            :switchVal="item.switchVal"
            :highlightVal="item.highlightVal"
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
  </div>
</template>

<script setup lang="ts">
import { IsUrgentType, orderStatus } from "@/config/dictionary"
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
    prop: "category_name",
    label: "报修类目",
    component: "GlobalColumn"
  },
  {
    prop: "repair_area_name",
    label: "报修区域",
    component: "GlobalColumn"
  },
  {
    prop: "build_floor",
    label: "报修楼层",
    component: "GlobalColumn"
  },
  {
    prop: "contact_name",
    label: "报修人",
    component: "GlobalColumn"
  },
  {
    prop: "contacts_info",
    label: "报修人电话",
    component: "GlobalColumn",
    width: 150
  },
  {
    prop: "is_urgent",
    label: "紧急程度",
    component: "GlobalColumn",
    switchVal: IsUrgentType,
    highlightVal: [1]
  },
  {
    prop: "is_timeout",
    label: "工单情况",
    component: "GlobalColumn",
    switchVal: orderStatus,
    highlightVal: [1]
  },
  {
    prop: "status_text",
    label: "工单状态",
    component: "GlobalColumn"
  },
  {
    prop: "name",
    label: "操作",
    component: "GlobalColumnBtn",
    width: 200,
    buttonArr: [
      {
        type: "success",
        label: "查看",
        funcName: "handleView"
      }
    ]
  }
]

//#region 查删
import { deleSetOrder, detailSetOrder, getOrderList } from "@/api/repair"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  admin_status: 12,
  order_no: "",
  category_name: "",
  contact_name: "",
  contacts_info: ""
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
} = useTable(contentBoxRef, searchBoxRef, getOrderList, deleSetOrder, paginationData, searchData)
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

// 详情
const viewVisible = ref<boolean>(false)
const activeNames = ref([1])
const showItem = ref<number[]>()
const viewType = ref<number>()
const viewTitle = ref<string>()
const handleView = async (row: any) => {
  getDetailOrder(row.id)
  viewType.value = undefined
  activeNames.value = [5]
  showItem.value = [1, 2, 3, 4, 5, 6]
  viewTitle.value = "查看"
  viewVisible.value = true
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="scss" scoped></style>
