<template>
  <global-drawer
    :show="show"
    :loading="btnOkLoading"
    :title="title"
    :isOk="!readOnly"
    :allLoading="allLoading"
    @open="handleOpen"
    @ok="handleOk"
    @closed="resetForm"
    @update:show="emit('update:show', false)"
  >
    <global-flow :flowArr="flowArr" :flowActive="flowActive"></global-flow>
    <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="auto">
      <el-form-item prop="record_id" label="关联维修单">
        <el-button type="primary" @click="tableSelectShow = true" v-if="!readOnly">{{
          formData.record_id ? "重新选择" : "选择"
        }}</el-button>
        <global-input v-model:value="formData.order_no" :disabled="readOnly" v-else></global-input>
      </el-form-item>
      <div v-if="formData.record_id">
        <el-form-item label="维修单位">
          <global-input :disabled="true" :value="currentTableSelect?.project_unit_name"></global-input>
        </el-form-item>
        <el-form-item label="银行账号信息">
          <global-input :disabled="true" :value="currentTableSelect?.bank_name"></global-input>
          <global-input
            :style="{ marginLeft: '20px' }"
            :disabled="true"
            :value="currentTableSelect?.bank_account"
          ></global-input>
        </el-form-item>
        <el-form-item label="合同金额">
          <global-input :disabled="true" :value="currentTableSelect?.contract_amount"></global-input>
        </el-form-item>
      </div>
      <el-form-item prop="type" label="款项类别">
        <el-radio-group v-model="formData.type" :disabled="readOnly">
          <el-radio :value="1">进度款</el-radio>
          <el-radio :value="2">决算款</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="pay_amount" label="申请支付金额">
        <global-input v-model:value="formData.pay_amount" type="number" :disabled="readOnly"></global-input>
      </el-form-item>
      <el-form-item prop="invoice" label="上传发票">
        <global-upload v-model:fileList="formData.invoice" :disabled="readOnly" isCloud></global-upload>
      </el-form-item>
    </el-form>
  </global-drawer>

  <global-table-radio
    v-model:show="tableSelectShow"
    :getListFun="getOutList"
    :params="{
      is_can_pay: 1,
      type: 1,
      out_is_auth: 1
    }"
    :columnArr="columnArr"
    title="请选择关联维修单"
    width="60%"
    @currentChange="currentChangeTable"
  ></global-table-radio>
</template>

<script setup lang="ts">
import { getOutList } from "@/api/outRepair"
import { IsUrgentType } from "@/config/dictionary"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { cloneDeep } from "lodash-es"

const props: any = withDefaults(
  defineProps<{
    show: boolean
    readOnly: boolean
    currentObj: Object
    flowArr?: Array<any>
    flowActive?: number
    allLoading: boolean
  }>(),
  {
    show: false,
    readOnly: false,
    currentObj: () => ({}),
    flowArr: () => [],
    flowActive: 0,
    allLoading: false
  }
)

const columnArr = [
  {
    prop: "order_no",
    label: "报修单号",
    component: "GlobalColumn",
    width: 200
  },
  {
    prop: "category_name",
    label: "维修类目",
    component: "GlobalColumn"
  },
  {
    prop: "repair_user_name",
    label: "维修员姓名",
    component: "GlobalColumn",
    width: 150
  },
  {
    prop: "repair_user_mobile",
    label: "维修员电话",
    component: "GlobalColumn",
    width: 150
  },
  {
    prop: "is_urgent",
    label: "紧急程度",
    component: "GlobalColumn",
    switchVal: IsUrgentType
  },
  {
    prop: "created_at",
    label: "申请时间",
    component: "GlobalColumn",
    width: 170
  },
  {
    prop: "status_text",
    label: "状态",
    component: "GlobalColumn"
  },
  {
    prop: "repair_user_name",
    label: "提交人",
    component: "GlobalColumn"
  }
]

const tableSelectShow = ref<boolean>(false)

// 表单
import { addRepairPay, getProjectBank } from "@/api/outRepair"
const validatePayAmout = (rule: any, value: any, callback: any) => {
  if (value === "") callback(new Error("请输入申请支付金额"))
  if (!currentTableSelect?.contract_amount) callback(new Error("请选择关联维修单"))
  if (+value > +currentTableSelect?.contract_amount) callback(new Error("申请支付金额不能大于合同金额"))
  callback()
}
const formRules: FormRules = {
  record_id: [{ required: true, trigger: "change", message: "请选择关联维修单" }],
  type: [{ required: true, trigger: "change", message: "请选择款项类别" }],
  pay_amount: [{ required: true, validator: validatePayAmout, trigger: "blur" }],
  invoice: [{ required: true, trigger: "change", message: "请上传发票" }]
}

const DEFAULT_FORM_DATA: any = {
  record_id: "",
  type: "",
  pay_amount: "",
  invoice: [],
  out_record_id: undefined
}
const formData = ref(cloneDeep(DEFAULT_FORM_DATA))
const formRef = ref<FormInstance | null>(null)
const btnOkLoading = ref<boolean>(false)
const emit = defineEmits(["update:show", "refresh"])
const handleOk = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    btnOkLoading.value = true
    addRepairPay(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        emit("update:show", false)
      })
      .finally(() => {
        btnOkLoading.value = false
      })
  })
}

const handleOpen = () => {
  Object.assign(currentTableSelect, props.currentObj)
  Object.assign(formData.value, props.currentObj)
  const { bank, all_money } = props.currentObj || {}

  currentTableSelect.bank_name = bank
  currentTableSelect.contract_amount = all_money

  console.log(formData.value, props.currentObj)
}

const currentTableSelect = reactive<any>({})
const currentChangeTable = async (val: any) => {
  const { record_id, project_unit_name, contract_amount, project_unit_id, out_record_id } = val
  formData.value.record_id = record_id
  const { data } = await getProjectBank({ project_unit_id })
  const { bank, bank_account } = data
  Object.assign(currentTableSelect, {
    project_unit_name,
    contract_amount,
    bank_name: bank,
    bank_account: bank_account
  })
  formData.value.bank = bank
  formData.value.bank_account = bank_account
  formData.value.out_record_id = out_record_id

  console.log(formData.value)
}

const resetForm = () => {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  formRef.value?.resetFields()
  emit("refresh")
}

let title = computed(() => {
  return formData.value.id === undefined ? "发起申请" : "查看详情"
})
</script>

<style lang="scss" scoped>
/* 样式 */
</style>
