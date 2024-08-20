<template>
  <global-drawer
    :show="show"
    :loading="btnOkLoading"
    :title="title"
    :isOk="!readOnly"
    @open="handleOpen"
    @ok="handleOk"
    @closed="resetForm"
    @update:show="emit('update:show', false)"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="auto">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="type" label="出库类型">
            <global-select
              v-model:value="formData.type"
              placeholder="请选择出库类型"
              :disabled="readOnly"
              :option="stockTemovalType"
            ></global-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="user_name" label="领用人">
            <global-input
              v-model:value="formData.user_name"
              placeholder="请输入领用人"
              :disabled="readOnly"
            ></global-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="user_reason" label="用途">
            <global-input
              v-model:value="formData.user_reason"
              placeholder="请输入用途"
              :disabled="readOnly"
            ></global-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="username" label="出库人">
            <global-input :value="formData.username" :disabled="true"></global-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="remark" label="备注">
        <global-input
          style="width: 100%"
          v-model:value="formData.remark"
          :disabled="readOnly"
          placeholder="请填写备注"
          type="textarea"
        ></global-input>
      </el-form-item>
      <el-form-item prop="detail" label="材料清单">
        <global-edit-table-add-dialog
          ref="editTableRef"
          v-model:tableValue="formData.detail"
          dialogTitle="选择材料清单"
          :searchObj="{
            label: '材料名称',
            key: 'part_name'
          }"
          :columnArrDialog="columnArrDialog"
          :cloumnArr="cloumnArr"
          :rules="rules"
          :readOnly="readOnly"
          :getListFun="getAllStockList"
        ></global-edit-table-add-dialog>
      </el-form-item>
      <el-form-item prop="detail" label="状态" v-if="readOnly">
        <global-input :disabled="true" value="已入库"></global-input>
      </el-form-item>
    </el-form>
  </global-drawer>
</template>

<script setup lang="ts">
import { getAllStockList } from "@/api/repertory"
import { stockTemovalType } from "@/config/dictionary"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { cloneDeep } from "lodash-es"

const props: any = withDefaults(
  defineProps<{
    show: boolean
    readOnly: boolean
    currentObj?: Object
  }>(),
  {
    show: false,
    readOnly: false,
    currentObj: () => ({})
  }
)

const cloumnArr = [
  {
    prop: "part_name",
    label: "材料名称",
    isEdit: false
  },
  {
    prop: "stock_num",
    label: "库存数量",
    type: "number",
    isEdit: false
  },
  {
    prop: "number",
    label: "出库数量",
    type: "number",
    isEdit: true
  }
]
const rules = {
  number: [
    {
      validator(val: any) {
        const { cellValue, row } = val
        if (!cellValue) return new Error("请输入数量")
        if (cellValue && row.stock_num < cellValue) {
          return new Error("数量不能超过库存数量")
        }
      }
    }
  ]
}

// 材料清单
const columnArrDialog = [
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
  }
]

//#region 表单
import { addOut } from "@/api/repertory"
import { useUserStore } from "@/store/modules/user"
const userStore = useUserStore()
const formRules: FormRules = {
  type: [{ required: true, trigger: "change", message: "请选择出库类型" }],
  user_name: [{ required: true, trigger: "change", message: "请输入领用人" }],
  user_reason: [{ required: true, trigger: "change", message: "请输入用途" }],
  detail: [{ required: true, trigger: "blue", message: "请选择材料清单" }]
}
const DEFAULT_FORM_DATA: any = {
  type: undefined,
  user_name: "",
  user_reason: "",
  username: userStore.username,
  remark: "",
  detail: []
}
const formData = ref(cloneDeep(DEFAULT_FORM_DATA))
const formRef = ref<FormInstance | null>(null)
const btnOkLoading = ref<boolean>(false)
const emit = defineEmits(["update:show", "refresh"])
const editTableRef = ref<any>()
const handleOk = () => {
  formRef.value?.validate(async (valid: boolean, fields) => {
    const isOk = await editTableRef.value?.validEvent()
    if (!valid || !isOk) return console.error("表单校验不通过", fields)
    btnOkLoading.value = true
    addOut(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        emit("update:show", false)
        emit("refresh")
      })
      .finally(() => {
        btnOkLoading.value = false
      })
  })
}
//#endregion

const handleOpen = () => {
  if (props.currentObj) {
    Object.assign(formData.value, props.currentObj)
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}

let title = computed(() => {
  return formData.value.id === undefined ? "新增出库" : "查看详情"
})

watch(
  () => formData.value.details,
  (v) => {
    if (!v.length) return (formData.value.amount = undefined)
    const val = formData.value.details.reduce((sum: any, item: any) => {
      return sum + (item.all_price || 0)
    }, 0)
    formData.value.amount = String(val)
  }
)
</script>

<style lang="scss" scoped>
/* 样式 */
</style>
