<template>
  <div class="app-container contentBoxGlobal" ref="contentBoxRef">
    <div ref="searchBoxRef">
      <el-card shadow="never" class="search-wrapper">
        <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="name" label="投书类型名称">
            <el-input v-model="searchData.name" placeholder="请输入" />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增类型</el-button>
          <el-button type="danger" :icon="Delete" @click="handleBatchDel">批量删除</el-button>
        </div>
        <div>
          <el-button type="primary" :icon="Setting" @click="drawerVisible = true">投诉须知配置</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" :max-height="height" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column width="100" type="index" label="序号" :index="indexMethod" />
          <el-table-column prop="name" label="投诉类型名称" />
          <el-table-column prop="created_at" label="创建时间" />
          <el-table-column width="200" fixed="right" label="操作">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      :title="formData.id === undefined ? '新增' : '修改'"
      :loading="diaBtnLoading"
      @closed="resetForm"
      @ok="addAndUpdateFun"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="name" label="投诉类型">
          <el-input v-model="formData.name" placeholder="请输入投诉类型" />
        </el-form-item>
      </el-form>
    </global-dialog>
    <global-drawer v-model:show="drawerVisible" title="投诉须知配置" @ok="updateDrawerVisible">
      <global-editor v-model:value="drawerContent" />
    </global-drawer>
  </div>
</template>

<script lang="ts" setup>
import { delReferType, editReferConfig, editReferType, getReferConfig, getReferTypeList } from "@/api/system"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
import { CirclePlus, Delete, Refresh, Search, Setting } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { cloneDeep } from "lodash-es"

defineOptions({
  name: "ComplainType"
})

onMounted(() => {
  getReferConfigFun()
})

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const contentBoxRef = ref<HTMLDivElement | null>()
const searchBoxRef = ref<HTMLDivElement | null>()
const formRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)
const diaBtnLoading = ref<boolean>(false)
const drawerVisible = ref<boolean>(false)
const drawerContent = ref<string>("")
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  type: ""
})

//#region 查
const {
  height,
  indexMethod,
  loading,
  tableData,
  getTableData,
  handleSearch,
  handleDelete,
  handleBatchDel,
  handleSelectionChange
} = useTable(contentBoxRef, searchBoxRef, getReferTypeList, delReferType, paginationData, searchData)
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

//#region 增
const DEFAULT_FORM_DATA = {
  id: undefined,
  name: ""
}
const formData = ref(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules = {
  name: [{ required: true, trigger: "blur", message: "请输入投诉类型" }]
}
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
//#endregion

//#region 改
const handleUpdate = (row: any) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 增改操作
const addAndUpdateFun = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    diaBtnLoading.value = true
    editReferType(formData.value)
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
//#endregion
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })

//#region 增改操作
const getReferConfigFun = async () => {
  const {
    data: { content }
  } = await getReferConfig()
  drawerContent.value = content
}
const updateDrawerVisible = async () => {
  console.log(drawerContent.value)
  await editReferConfig({
    content: drawerContent.value
  })
  ElMessage.success("操作成功")
  drawerVisible.value = false
}
//#endregion
</script>

<style lang="scss" scoped></style>
