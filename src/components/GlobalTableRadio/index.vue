<template>
  <global-dialog :width="width" :title="title" :show="show" @ok="handleOk" @update:show="emit('update:show', false)">
    <el-form class="search-wrapper" ref="searchFormRef" :inline="true" :model="searchData">
      <el-form-item :prop="searchObj.key" :label="searchObj.label">
        <global-input v-model:value="currentValue"></global-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrapper">
      <global-table
        v-bind="tableParams"
        @current-change="handleCurrentChangePage"
        @selection-change="handleSelectionChange"
      >
        <component
          v-for="item in columnArr"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :is="item.component"
          :width="item.width"
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
import { Refresh, Search } from "@element-plus/icons-vue"
import { type FormInstance } from "element-plus"
import { ref } from "vue"

const props = withDefaults(
  defineProps<{
    show: boolean
    getListFun?: Function
    params?: Object
    title?: string
    width?: string
    columnArr?: Array<any>
    isShowSelect?: boolean
    searchObj?: any
  }>(),
  {
    show: false,
    getListFun: () => {},
    params: () => ({}),
    title: "",
    width: "40%",
    columnArr: () => [],
    isShowSelect: false,
    searchObj: () => ({
      label: "报修单号",
      key: "order_no"
    })
  }
)

// 方法
const emit = defineEmits(["update:show", "currentChange"])
const currentObj = ref<any>({})
const handleCurrentChangePage = (val: any) => {
  if (!props.isShowSelect) {
    currentObj.value = val
  }
}
const handleOk = () => {
  if (props.isShowSelect) {
    emit("currentChange", multipleSelectionAllArr.value)
  } else {
    emit("currentChange", currentObj.value)
  }
  emit("update:show", false)
}

const searchData: any = reactive({
  ...props.params
})

const currentValue = computed({
  get() {
    return props.searchObj?.key ? searchData[props.searchObj?.key] : ""
  },
  set(newValue) {
    if (props.searchObj?.key) {
      searchData[props.searchObj?.key] = newValue
    }
  }
})
//#region 查
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const {
  loading,
  multipleSelectionAllArr,
  tableData,
  handleSearch,
  handleSelectionChange
  // work
} = useTable("", "", props.getListFun, props.getListFun, paginationData, searchData)
// 表格参数
const tableParams = reactive({
  tableHeight: 350,
  data: tableData,
  loading,
  handleSelectionChange,
  isShowSelect: props.isShowSelect
})
handleSearch()
//#endregion

// 重置
const searchFormRef = ref<FormInstance | null>(null)
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
</script>

<style lang="scss" scoped>
::v-deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset !important;
}
::v-deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset !important;
}
</style>
