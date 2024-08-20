<template>
  <div style="width: 100%">
    <vxe-toolbar v-if="!readOnly && isNoBtn">
      <template #buttons>
        <vxe-button @click="insertEvent">新增</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      border
      keep-source
      ref="tableRef"
      :max-height="maxHeight"
      :data="tableValue"
      :edit-rules="rules"
      :edit-config="{ trigger: 'click', mode: 'row', showStatus: true, enabled: !readOnly }"
    >
      <vxe-column type="seq" width="80" title="序号"></vxe-column>
      <vxe-column
        v-for="(v, i) in cloumnArr"
        :key="i"
        :field="v.prop"
        :width="v.width"
        :title="v.label"
        :edit-render="v.isEdit ? {} : undefined"
      >
        <template #edit="slotParams">
          <vxe-input v-model="slotParams.row[v.prop]" :type="v.type" @change="changeCellEvent(slotParams)"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="100" v-if="!readOnly && isNoBtn">
        <template #default="{ row }">
          <vxe-button @click="removeRowEvent(row)">删除</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from "vue"
import { VxeTableInstance, VxeTablePropTypes } from "vxe-table"

const props: any = withDefaults(
  defineProps<{
    cloumnArr: Array<any>
    rules?: VxeTablePropTypes.EditRules
    maxHeight?: number
    readOnly?: boolean
    tableValue?: Array<any>
    isNoBtn?: boolean
  }>(),
  {
    cloumnArr: () => [],
    maxHeight: 300,
    readOnly: false,
    tableValue: () => [],
    isNoBtn: true
  }
)

const tableRef = ref<VxeTableInstance<any>>()
const emit = defineEmits(["update:tableValue"])

// 更新
const changeCellEvent = async (params: any) => {
  const $table = tableRef.value
  if ($table) {
    const { visibleData } = params
    const obj = props.cloumnArr.find((item: any) => item.compute)
    if (obj) {
      visibleData.forEach((g: any) => {
        g[obj.prop] = obj.compute(g)
      })
    }
    emit("update:tableValue", visibleData)
    $table.updateStatus(params)
    await $table.validate(true)
  }
}

// 快速校验变动数据
const validEvent = async () => {
  const $table = tableRef.value
  if ($table) {
    const errMap = await $table.validate(true)
    if (errMap) {
      return false
    }
    return true
  }
}
defineExpose({
  validEvent
})

// 新增
const insertEvent = async () => {
  const $table = tableRef.value
  if ($table) {
    const { row: newRow } = await $table.insert({})
    await $table.validate(newRow)
  }
}

// 删除
const removeRowEvent = async (row: any) => {
  const $table = tableRef.value
  if ($table) {
    $table.remove(row)
  }
  const allTable = $table?.getTableData()?.tableData
  emit("update:tableValue", allTable)
}
</script>
