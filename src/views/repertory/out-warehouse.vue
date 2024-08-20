<template>
  <div class="app-container contentBoxGlobal" ref="contentBoxRef">
    <div ref="searchBoxRef">
      <el-card shadow="never" class="search-wrapper">
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="out_no" label="出库单号">
            <global-input v-model:value="searchData.out_no" placeholder="请输入出库单号"></global-input>
          </el-form-item>
          <el-form-item prop="out_time" label="出库时间">
            <el-date-picker
              style="width: 370px"
              v-model="searchData.out_time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleTimeChange"
              value-format="YYYY-MM-DD HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="type" label="出库类型">
            <global-select
              v-model:value="searchData.type"
              :option="stockTemovalType"
              placeholder="请选择出库类型"
            ></global-select>
          </el-form-item>
          <el-form-item prop="creator" label="出库人">
            <global-input v-model:value="searchData.creator" placeholder="请输入出库人"></global-input>
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
          <el-button type="primary" :icon="CirclePlus" @click="addApply">新增出库</el-button>
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
            :value="item.value"
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
    <out-apply-drawer
      v-model:show="drawerVisible"
      :readOnly="readOnly"
      :currentObj="currentObj"
      @refresh="getTableData"
    ></out-apply-drawer>
  </div>
</template>

<script setup lang="ts">
import { stockTemovalType } from "@/config/dictionary"
import { CirclePlus, Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance } from "element-plus"
import outApplyDrawer from "./components/outApplyDrawer.vue"

// 表格列参数
const columnArr = [
  {
    prop: "out_no",
    label: "出库单号",
    component: "GlobalColumn",
    width: 200
  },
  {
    prop: "type",
    label: "出库类型",
    component: "GlobalColumn",
    switchVal: stockTemovalType
  },
  {
    prop: "creator",
    label: "出库人",
    component: "GlobalColumn"
  },
  {
    prop: "user_name",
    label: "领用人",
    component: "GlobalColumn"
  },
  {
    prop: "user_reason",
    label: "用途",
    component: "GlobalColumn"
  },
  {
    prop: "created_at",
    label: "出库时间",
    component: "GlobalColumn",
    width: 170
  },
  {
    prop: "created_at",
    label: "出库状态",
    component: "GlobalColumn",
    value: "已出库"
  },
  {
    prop: "name",
    label: "操作",
    component: "GlobalColumnBtn",
    width: 200,
    buttonArr: [
      {
        type: "success",
        label: "查看详情",
        funcName: "handleView"
      }
    ]
  }
]

const handleTimeChange = (v: any) => {
  if (v.length) {
    searchData.start_time = v[0]
    searchData.end_time = v[1]
  } else {
    searchData.start_time = ""
    searchData.end_time = ""
  }
}

//#region 查删
import { getOutList } from "@/api/repertory"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  out_no: "",
  out_time: "",
  start_time: "",
  end_time: "",
  type: "",
  creator: ""
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
// 重置
const searchFormRef = ref<FormInstance | null>(null)
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  searchData.start_time = ""
  searchData.end_time = ""
  handleSearch()
}
//#endregion

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
// 详情

const handleView = async (row: any) => {
  // const { data } = await detailSetOrder({ id: row.id })
  console.log(row)
  currentObj.value = row
  readOnly.value = true
  drawerVisible.value = true
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>
