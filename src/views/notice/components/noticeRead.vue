<template>
  <global-dialog title="阅读情况" width="70%" :show="show" :isOk="false" @update:show="emit('update:show', false)">
    <el-form ref="searchFormRef" :inline="true" :model="searchData">
      <el-form-item prop="name" label="姓名">
        <global-input v-model:value="searchData.name" placeholder="请输入姓名"></global-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="toolbar-wrapper">
      <div>已查看人数：{{ allDate?.read_num }} 人</div>
    </div>
    <div class="table-wrapper">
      <global-table v-bind="tableParams">
        <component
          v-for="item in columnArr"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :is="item.component"
          :switchVal="item.switchVal"
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
  </global-dialog>
</template>

<script setup lang="ts">
import { readStatus } from "@/config/dictionary"
import { Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance } from "element-plus"

const props = withDefaults(
  defineProps<{
    show: boolean
    currentId: string
  }>(),
  {
    show: false
  }
)

// 表格列参数
const columnArr = [
  {
    prop: "name",
    label: "公告标题",
    component: "GlobalColumn"
  },
  {
    prop: "sys_name",
    label: "阅读人",
    component: "GlobalColumn"
  },
  {
    prop: "status",
    label: "状态",
    component: "GlobalColumn",
    switchVal: readStatus
  },
  {
    prop: "read_at",
    label: "阅读时间",
    component: "GlobalColumn"
  }
]

//#region 查删
import { getNoticeRead } from "@/api/notice"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  name: "",
  id: ""
})
const {
  allDate,
  loading,
  tableData,
  getTableData,
  handleSearch,
  handleSelectionChange
  // work
} = useTable("", "", getNoticeRead, getNoticeRead, paginationData, searchData)
// 表格参数
const tableParams = reactive({
  data: tableData,
  tableHeight: 350,
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

const emit = defineEmits(["update:show"])

// 监听
watch(
  () => props.show,
  () => {
    searchData.id = props.currentId
    getTableData()
  }
)
</script>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 10px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
.table-wrapper {
  margin-bottom: 20px;
}
.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}

.toolbar-wrapper {
  display: flex;
  margin-bottom: 20px;
}
</style>
