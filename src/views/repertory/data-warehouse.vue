<template>
  <div class="app-container contentBoxGlobal" ref="contentBoxRef">
    <div ref="searchBoxRef">
      <el-card shadow="never" class="search-wrapper">
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="part_name" label="材料名称">
            <global-input v-model:value="searchData.part_name" placeholder="请输入材料名称"></global-input>
          </el-form-item>
          <el-form-item prop="is_min" label="预警线">
            <global-select v-model:value="searchData.is_min" :option="IsNo" placeholder="请选择预警线"></global-select>
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
          <el-button type="primary" @click="handleExport" :loading="loadingBtnLoading">
            导出
            <el-icon class="el-icon--right"><Upload /></el-icon>
          </el-button>
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
            :highlightVal="item.highlightVal"
            @handleSetLine="handleSetLine"
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
    <!-- 新增/修改 -->
    <global-dialog
      v-model:show="dialogVisible"
      title="设置预警线"
      :loading="diaBtnLoading"
      @closed="resetForm"
      @ok="addAndUpdateFun"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="min_stock" label="预警线">
          <global-input v-model:value="formData.min_stock" type="number" placeholder="请输入预警线"></global-input>
        </el-form-item>
      </el-form>
    </global-dialog>
  </div>
</template>

<script setup lang="ts">
import { IsNo } from "@/config/dictionary"
import { Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"

// 表格列参数
const columnArr = [
  {
    prop: "part_name",
    label: "材料名称",
    component: "GlobalColumn"
  },
  {
    prop: "stock_num",
    label: "库存数量",
    component: "GlobalColumn"
  },
  {
    prop: "min_stock",
    label: "最小提醒数",
    component: "GlobalColumn"
  },
  {
    prop: "is_min",
    label: "是否低于预警线",
    component: "GlobalColumn",
    highlightVal: ["是"]
  },
  {
    prop: "updated_at",
    label: "更新时间",
    component: "GlobalColumn",
    width: 170
  },
  {
    label: "操作",
    component: "GlobalColumnBtn",
    width: 200,
    buttonArr: [
      {
        type: "primary",
        label: "设置预警线",
        funcName: "handleSetLine"
      }
    ]
  }
]

//#region 查删
import { exportStockList, getAllStockList, setStockMin } from "@/api/repertory"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  part_name: "",
  is_min: undefined
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
} = useTable(contentBoxRef, searchBoxRef, getAllStockList, getAllStockList, paginationData, searchData)
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

// #region 导出
import { exportFun } from "@/utils"
const loadingBtnLoading = ref<boolean>(false)
const handleExport = async () => {
  loadingBtnLoading.value = true
  const res = await exportStockList({
    ...searchData,
    is_export: 1,
    page: paginationData.currentPage,
    page_size: paginationData.pageSize
  })
  console.log(res)
  await exportFun(res, "库存数据")
  loadingBtnLoading.value = false
}
// #endregion

// #region 表单
const DEFAULT_FORM_DATA = {
  min_stock: ""
}
const formData = ref(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
const formRules: FormRules = {
  min_stock: [{ required: true, trigger: "blur", message: "请输入预警线值" }]
}
const formRef = ref<FormInstance | null>(null)
let dialogVisible = ref<boolean>(false)
let diaBtnLoading = ref<boolean>(false)
let currentRow = ref<any>({})

const handleSetLine = async (row: any) => {
  currentRow.value = row
  dialogVisible.value = true
}
// #endregion

const addAndUpdateFun = () => {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return
    diaBtnLoading.value = true
    setStockMin({
      ...formData.value,
      id: currentRow.value.id
    })
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        handleSearch()
      })
      .finally(() => {
        diaBtnLoading.value = false
      })
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA))
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>
