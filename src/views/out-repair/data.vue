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
          <el-form-item prop="is_urgent" label="紧急程度">
            <global-select
              v-model:value="searchData.is_urgent"
              :option="IsUrgentType"
              placeholder="请选择紧急程度"
            ></global-select>
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

    <out-view
      v-model:show="viewVisible"
      :currentObj="currentObj"
      :title="viewTitle"
      :activeNames="activeNames"
      :showItem="showItem"
      :flowArr="flowArr"
      :flowActive="flowActive"
      :allLoading="allLoading"
      @refresh="getTableData"
    ></out-view>
  </div>
</template>

<script setup lang="ts">
import { IsUrgentType } from "@/config/dictionary"
import { Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance } from "element-plus"
import outView from "./components/outView.vue"

const tableTabsParams = reactive({
  activeName: "proceed",
  tabsArr: [
    {
      label: "进行中",
      name: "proceed"
    },
    {
      label: "已结束",
      name: "end"
    }
  ]
})
const handleTabClick = (tabName: string) => {
  if (tabName === "proceed") {
    searchData.type = 1
  } else if (tabName === "end") {
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
    prop: "category_name",
    label: "维修类目",
    component: "GlobalColumn"
  },
  {
    prop: "repair_user_name",
    label: "维修员姓名",
    component: "GlobalColumn",
    width: 150
  },
  {
    prop: "repair_user_mobile",
    label: "维修员电话",
    component: "GlobalColumn",
    width: 150
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
    prop: "repair_user_name",
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
        type: "success",
        label: "查看",
        funcName: "handleView"
      }
    ]
  }
]

//#region 查删
import { getOutDetail, getOutList } from "@/api/outRepair"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  type: 1,
  order_no: "",
  category_name: "",
  is_urgent: ""
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
} = useTable(contentBoxRef, searchBoxRef, getOutList, getOutList, paginationData, searchData)
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
import { useFlow } from "@/hooks/useFlow"
const currentObj = ref<any>()
const { getSetps, flowArr, flowActive, approvalStatusText } = useFlow()
const getDetailOrder = async (row: any) => {
  const { id, out_record_id } = row
  flowArr.value = []
  flowActive.value = 0
  approvalStatusText.value = ""
  try {
    await getSetps({
      id: out_record_id,
      type: 2
    })
    const { data } = await getOutDetail({ id })
    currentObj.value = data
  } catch (error) {
    console.log(error)
  } finally {
    allLoading.value = false
  }
}

// 详情
const viewVisible = ref<boolean>(false)
const viewTitle = ref<string>("查看详情")
const showItem = ref<number[]>()
const activeNames = ref([1])
const allLoading = ref<boolean>(false)
const handleView = async (row: any) => {
  allLoading.value = true
  getDetailOrder(row)
  activeNames.value = [1, 2]
  showItem.value = [1, 2]
  viewVisible.value = true
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="scss" scoped></style>
