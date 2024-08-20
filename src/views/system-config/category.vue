<template>
  <div class="contentBoxGlobal">
    <div style="height: 100%" ref="tableEleRef">
      <!-- <vxe-toolbar class="contentBox__top" ref="toolbarRef" :refresh="{ queryMethod: searchMethod }">
        <template #buttons>
          <vxe-button status="primary" @click="insertFun">新增顶级节点</vxe-button>
        </template>
      </vxe-toolbar> -->
      <vxe-table
        class="contentBox__table"
        show-overflow
        keep-source
        ref="tableRef"
        :height="height - 50"
        :row-config="{ keyField: 'id' }"
        :column-config="{ resizable: true }"
        :loading="loading"
        :tree-config="{ transform: true, rowField: 'id', parentField: 'pid' }"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        :data="tableData"
        @edit-closed="handleEditClosed"
      >
        <vxe-column type="seq" width="120" title="序号"></vxe-column>
        <vxe-column field="category_name" title="类目名称" tree-node :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input v-model="row.category_name" mode="text"></vxe-input>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="300">
          <template #default="{ row }">
            <vxe-button mode="text" status="primary" @click="insertFun(row)">插入子节点</vxe-button>
            <vxe-button mode="text" v-if="row.pid" status="danger" @click="removeRow(row)">删除节点</vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { delMaintenance, editMaintenance, getMaintenanceList } from "@/api/system"
import { useBottom } from "@/hooks/useBottom"
import { watchEle } from "@/hooks/userContentHeight"
import { ElMessage } from "element-plus"
import { nextTick, ref } from "vue"
import { VxeTableInstance, VxeToolbarInstance } from "vxe-table"

interface RowVO {
  id: number
  category_name: string
  pid: number
  created_at: string
}

const { uConfirm } = useBottom()

const loading = ref(false)
const tableData = ref<RowVO[]>([])
const tableRef = ref<VxeTableInstance<RowVO>>()
const toolbarRef = ref<VxeToolbarInstance>()
const openObj = ref<RowVO[]>([])
const tableEleRef = ref<HTMLDivElement | null>(null)
const { height } = watchEle(tableEleRef)

nextTick(() => {
  // 将表格和工具栏进行关联
  const $table = tableRef.value
  const $toolbar = toolbarRef.value
  if ($table && $toolbar) {
    $table.connect($toolbar)
  }
})

onMounted(() => {
  getListDate()
})

const searchMethod = () => {
  if (!tableRef.value) return
  tableRef.value.clearAll()
  getListDate()
}

const getListDate = async () => {
  loading.value = true
  const { data } = await getMaintenanceList()
  tableData.value = data
  loading.value = false
}

const handleEditClosed = async ({ row, column }: { row: any; column: any }) => {
  const $table = tableRef.value
  if (!$table) return
  if (!row.category_name) {
    return await $table.remove(row)
  }
  if (row.category_name === column.model?.value) return
  const { category_name, pid, id } = row
  try {
    await editMaintenance({
      category_name,
      pid,
      id: id === -1 ? "" : id
    })
    ElMessage({
      message: "操作成功",
      type: "success"
    })
  } catch (error) {
    console.log(error)
  }
  await searchMethod()
  openObj.value = []
  await openthree(row.pid)
  openObj.value.reverse().forEach((v) => {
    $table.setTreeExpand(v, true)
  })
}

const openthree = (pid: number) => {
  const obj = tableData.value.find((item) => item.id === pid)
  if (obj) {
    openObj.value.push(obj)
    openthree(obj.pid || 0)
  }
}

const removeRow = (row: RowVO) => {
  uConfirm("删除该节点", async () => {
    await delMaintenance({
      id: row.id
    })
    ElMessage({
      message: "删除成功",
      type: "success"
    })

    await searchMethod()
    openObj.value = []
    await openthree(row.pid)
    const $table = tableRef.value
    openObj.value.reverse().forEach((v: any) => {
      $table?.setTreeExpand(v, true)
    })
  })
}

const insertFun = async (currRow: any) => {
  const $table = tableRef.value
  if (!$table) return
  const record = {
    category_name: "",
    id: -1,
    pid: 0
  }
  if (currRow) {
    record.pid = currRow.id
  }
  const { row: newRow } = await $table.insert(record)
  if (currRow) {
    await $table.setTreeExpand(currRow, true)
  }
  await $table.setEditRow(newRow)
}
</script>
<style lang="scss" scoped></style>
