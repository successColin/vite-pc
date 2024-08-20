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
          <el-form-item prop="admin_status" label="状态">
            <el-select
              v-model="searchData.admin_status"
              placeholder="请选择状态"
              style="width: 200px"
              clearable
              filterable
              :disabled="statusDisabled"
            >
              <el-option v-for="item in libraryType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
    <global-table-tabs v-bind="tableTabsParams" @tabClick="handleTabClick">
      <el-card shadow="never">
        <div class="toolbar-wrapper">
          <div>
            <el-button type="primary" :icon="CirclePlus" @click="addForm">新增工单</el-button>
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
              :otherHighlightVal="item.otherHighlightVal"
              :switchVal="item.switchVal"
              @handleAfterSchoolAudit="handleAfterSchoolAudit"
              @handleMaterialsAudit="handleMaterialsAudit"
              @handleUpdate="handleUpdate"
              @handleDelete="handleDelete"
              @handleView="handleView"
              @handleSendOrders="handleSendOrders"
              @handleCheck="handleCheck"
              @handleEvaluate="handleEvaluate"
              @handleComplain="handleComplain"
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
    <order-drawer v-model:show="drawerVisible" :currentObj="currentObj" @refresh="getTableData"></order-drawer>
    <order-view
      v-model:show="viewVisible"
      :isMaterials="isMaterials"
      :title="viewTitle"
      :showItem="showItem"
      :activeNames="activeNames"
      :currentObj="currentObj"
      :viewType="viewType"
      @refresh="getTableData"
    ></order-view>
    <order-send v-model:show="sendVisible" :currentId="currentId" @refresh="getTableData"></order-send>
  </div>
</template>

<script lang="ts" setup>
import { deleSetOrder, detailSetOrder, getOrderList } from "@/api/repair"
import { IsUrgentType, libraryType, orderStatus } from "@/config/dictionary"
import { useBottom } from "@/hooks/useBottom"
import { usePagination } from "@/hooks/usePagination"
import { useTable } from "@/hooks/useTable"
import { CirclePlus, Refresh, Search } from "@element-plus/icons-vue"
import { ElMessage, type FormInstance } from "element-plus"
import orderDrawer from "./components/orderDrawer.vue"
import orderSend from "./components/orderSend.vue"
import orderView from "./components/orderView.vue"

defineOptions({
  name: "WorkOrder"
})

const tableTabsParams = reactive({
  activeName: "all",
  tabsArr: [
    {
      label: "全部",
      name: "all"
    },
    {
      label: "待接单",
      name: "await"
    },
    {
      label: "超时/紧急",
      name: "exigency"
    }
  ]
})

//#region 查删
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const searchData = reactive({
  order_no: "",
  category_name: "",
  admin_status: "" as string | number,
  contact_name: "",
  contacts_info: "",
  urgent_or_timeout: ""
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

const { uConfirm } = useBottom()
const handleDelete = (row: any) => {
  uConfirm("取消该条数据", async () => {
    await deleSetOrder({
      id: row.id
    })
    ElMessage({
      message: "取消成功",
      type: "success"
    })
    handleSearch()
  })
}
//#endregion

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
    width: 130
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
    component: "GlobalColumn",
    otherHighlightVal: {
      prop: "is_urgent",
      val: 1
    }
  },
  {
    prop: "name",
    label: "操作",
    component: "GlobalColumnBtn",
    width: 300,
    buttonArr: [
      {
        type: "primary",
        label: "派单",
        funcName: "handleSendOrders",
        isShow: [
          {
            prop: "status",
            value: 0,
            type1: "==",
            prop1: "is_timeout",
            value1: 1
          },
          {
            prop: "status",
            value: 0,
            type1: "==",
            prop1: "is_urgent",
            value1: 1
          }
        ]
      },
      // 校外
      {
        type: "primary",
        label: "审核",
        funcName: "handleAfterSchoolAudit",
        isShow: [
          {
            prop: "status",
            value: 5,
            type1: "==",
            prop1: "out_is_auth",
            value1: 1
          }
        ]
      },
      // 材料
      {
        type: "primary",
        label: "审核",
        funcName: "handleMaterialsAudit",
        isShow: [
          {
            prop: "status",
            value: 6,
            type1: "==",
            prop1: "cg_is_auth",
            value1: 1
          }
        ]
      },
      {
        type: "primary",
        label: "验收",
        funcName: "handleCheck",
        isShow: [
          {
            prop: "status",
            value: 7,
            type1: "==",
            prop1: "source_type",
            value1: 2
          }
        ]
      },
      {
        type: "primary",
        label: "评价",
        funcName: "handleEvaluate",
        isShow: [
          {
            prop: "status",
            value: [9]
          }
        ]
      },
      {
        type: "primary",
        label: "处理",
        funcName: "handleComplain",
        isShow: [
          {
            prop: "status",
            value: [10]
          }
        ]
      },
      {
        type: "success",
        label: "查看",
        funcName: "handleView"
      },
      {
        type: "primary",
        label: "修改",
        funcName: "handleUpdate",
        isShow: [
          {
            prop: "status",
            value: 0
          }
        ]
      },
      {
        type: "danger",
        label: "取消",
        funcName: "handleDelete",
        isShow: [
          {
            prop: "status",
            value: [0]
          }
        ]
      }
    ]
  }
]

// 派单
const currentId = ref<number>(0)
const sendVisible = ref<boolean>(false)
const handleSendOrders = async (row: any) => {
  sendVisible.value = true
  currentId.value = row.id
}

// 验收 和 详情
const viewVisible = ref<boolean>(false)
const activeNames = ref([1])
const showItem = ref<number[]>()
const viewType = ref<number>()
const viewTitle = ref<string>()
const isMaterials = ref<boolean>(false)
const handleCheck = async (row: any) => {
  await getDetailOrder(row.id)
  viewType.value = 1
  activeNames.value = [2]
  showItem.value = [1, 2]
  viewTitle.value = "验收审核"
  isMaterials.value = false
  viewVisible.value = true
}

// 评价
const handleEvaluate = async (row: any) => {
  await getDetailOrder(row.id)
  viewType.value = 2
  activeNames.value = [3]
  showItem.value = [1, 2, 3]
  viewTitle.value = "评价"
  isMaterials.value = false
  viewVisible.value = true
}

// 投诉
const handleComplain = async (row: any) => {
  await getDetailOrder(row.id)
  viewType.value = 3
  activeNames.value = [5]
  showItem.value = [1, 2, 3, 4, 5]
  viewTitle.value = "投诉"
  isMaterials.value = false
  viewVisible.value = true
}

// 校外审核
const handleAfterSchoolAudit = async (row: any) => {
  await getDetailOrder(row.id)
  viewType.value = 4
  activeNames.value = [1, 2]
  showItem.value = [1, 2]
  viewTitle.value = `${row.status_text}审核`
  isMaterials.value = false
  viewVisible.value = true
}

// 材料审核
const handleMaterialsAudit = async (row: any) => {
  await getDetailOrder(row.id)
  viewType.value = 4
  activeNames.value = []
  showItem.value = [1, 2]
  viewTitle.value = `${row.status_text}审核`
  isMaterials.value = true
  viewVisible.value = true
}

// 详情
const handleView = async (row: any) => {
  await getDetailOrder(row.id)

  viewType.value = undefined
  activeNames.value = [1]
  showItem.value = [1, 2, 3, 4, 5, 6]
  viewTitle.value = "查看"
  isMaterials.value = false
  viewVisible.value = true
}

const drawerVisible = ref<boolean>(false)
const currentObj = ref<any>()

// 新增
const addForm = () => {
  drawerVisible.value = true
  currentObj.value = {}
}

// 改
const handleUpdate = async (row: any) => {
  await getDetailOrder(row.id)
  drawerVisible.value = true
}

// 获取详情
const getDetailOrder = async (id: number) => {
  const { data } = await detailSetOrder({ id })
  currentObj.value = data
}

// 重置
const searchFormRef = ref<FormInstance | null>(null)
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

// 监听
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })

// 切换表格
const statusDisabled = ref<boolean>(false)
const handleTabClick = (tabName: string) => {
  console.log(`Tab clicked: ${tabName}`)
  if (tabName === "all") {
    statusDisabled.value = false
    searchData.admin_status = ""
  } else if (tabName === "await") {
    statusDisabled.value = true
    searchData.admin_status = 0
  } else if (tabName === "exigency") {
    statusDisabled.value = true
    searchData.admin_status = 0
  }

  if (tabName === "exigency") {
    searchData.urgent_or_timeout = "1"
  } else {
    searchData.urgent_or_timeout = ""
  }
  handleSearch()
}
</script>

<style lang="scss" scoped></style>
