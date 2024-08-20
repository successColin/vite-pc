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
      <el-form-item prop="procure_no" label="关联采购单号">
        <el-button style="margin-right: 10px" v-if="!readOnly" type="primary" @click="tableSelectShow = true">{{
          formData.procure_no ? "重新选择" : "选择"
        }}</el-button>
        <global-input v-if="formData.procure_no" :disabled="true" :value="formData.procure_no"></global-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="type" label="入库类型">
            <global-select
              v-model:value="formData.type"
              :option="entryType"
              placeholder="请选择入库类型"
              @change="handleTypeChange"
            ></global-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="username" label="入库人">
            <global-input :value="formData.username" :disabled="true"></global-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item prop="address" label="存放地址">
        <global-input
          style="width: 100%"
          v-model:value="formData.address"
          :disabled="readOnly"
          placeholder="请填写存放地址"
          type="textarea"
        ></global-input>
      </el-form-item> -->
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
        <global-edit-table
          ref="editTableRef"
          v-model:tableValue="formData.detail"
          :cloumnArr="cloumnArr"
          :rules="rules"
          :readOnly="readOnly"
        ></global-edit-table>
      </el-form-item>
      <el-form-item prop="detail" label="状态" v-if="readOnly">
        <global-input :disabled="true" value="已入库"></global-input>
      </el-form-item>
    </el-form>
  </global-drawer>

  <global-table-radio
    v-model:show="tableSelectShow"
    :getListFun="getProcureList"
    :params="{
      status: 1
    }"
    :columnArr="columnArr"
    title="请选择关联维修单"
    width="60%"
    @currentChange="currentChangeTable"
  ></global-table-radio>
</template>

<script setup lang="ts">
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
    isEdit: true
  },
  {
    prop: "price",
    label: "单价（元）",
    isEdit: true
  },
  {
    prop: "number",
    label: "数量",
    isEdit: true
  },
  {
    prop: "all_price",
    label: "小计（元）",
    compute: (row: any) => {
      if (!row.price || !row.price) return 0
      return row.price * row.number
    },
    isEdit: false
  }
]
const rules = {
  part_name: [{ required: true, message: "请填写材料名称" }],
  price: [{ required: true, type: "number", min: 0, max: 100000, message: "请输入单价（元）" }],
  number: [{ required: true, type: "number", min: 0, max: 100000, message: "请输入数量" }]
}

//#region 表单
import { addStock } from "@/api/repertory"
import { useUserStore } from "@/store/modules/user"
const userStore = useUserStore()
const formRules = ref<FormRules>({
  type: [{ required: true, trigger: "change", message: "请选择入库类型" }],
  detail: [{ required: true, trigger: "change", message: "请输入材料清单" }]
})

const DEFAULT_FORM_DATA: any = {
  procure_no: "",
  type: "",
  remark: "",
  // address: "",
  detail: [],
  username: userStore.username
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
    addStock(formData.value)
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

const handleTypeChange = (v: any) => {
  console.log(formData.value)
  formRules.value = {
    type: [{ required: true, trigger: "change", message: "请选择入库类型" }],
    detail: [{ required: true, trigger: "change", message: "请输入材料清单" }]
  }
  if (v === 1) {
    formRules.value.procure_no = [{ required: true, trigger: "change", message: "请选择关联采购单号" }]
  }
}

import { getProcureList } from "@/api/purchase"
import { entryType } from "@/config/dictionary"
const tableSelectShow = ref<boolean>(false)
const columnArr = [
  {
    prop: "procure_no",
    label: "采购单号",
    component: "GlobalColumn"
  },
  {
    prop: "order_no",
    label: "报修单号",
    component: "GlobalColumn"
  },
  {
    prop: "amount",
    label: "采购金额",
    component: "GlobalColumn"
  },
  {
    prop: "created_at",
    label: "申请时间",
    component: "GlobalColumn"
  },
  {
    prop: "status_text",
    label: "采购单状态",
    component: "GlobalColumn"
  },
  {
    prop: "creator",
    label: "提交人",
    component: "GlobalColumn"
  }
]
const currentChangeTable = (val: any) => {
  formData.value.procure_no = val.procure_no
  formData.value.detail = val.details
}

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
  return formData.value.id === undefined ? "新增入库" : "查看详情"
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
