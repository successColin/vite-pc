<template>
  <global-drawer
    :show="show"
    :loading="btnOkLoading"
    title="提交审批"
    :allLoading="allLoading"
    @open="handleOpen"
    @ok="handleOk"
    @closed="resetForm"
    @update:show="emit('update:show', false)"
  >
    <global-flow :flowArr="flowArr" :flowActive="flowActive"></global-flow>

    <el-collapse :model-value="activeNames">
      <el-collapse-item title="相关信息" :name="1">
        <global-descriptions :arr="info1" title="材料采购申请"></global-descriptions>
        <el-descriptions>
          <el-descriptions-item label="材料清单">
            <global-edit-table
              style="width: 100%"
              v-model:tableValue="formData.details"
              :cloumnArr="cloumnArr"
              :rules="rules"
              :readOnly="true"
            ></global-edit-table>
          </el-descriptions-item>
        </el-descriptions>
        <flow-item class="m-t-1" v-for="(v, i) in showFlowDecArr" :key="i" :item="v"></flow-item>
      </el-collapse-item>
      <el-collapse-item title="打款凭证" :name="2">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="auto">
          <el-form-item prop="payment_voucher" label="打款凭证">
            <global-upload v-model:fileList="formData.payment_voucher" isCloud></global-upload>
          </el-form-item>
          <el-form-item prop="payment_time" label="打款时间">
            <el-date-picker
              style="width: 370px"
              v-model="formData.payment_time"
              type="datetime"
              placeholder="请选择打款时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </global-drawer>
</template>

<script setup lang="ts">
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { cloneDeep } from "lodash-es"
import flowItem from "./flowItem.vue"

const props: any = withDefaults(
  defineProps<{
    show: boolean
    currentObj?: Object
  }>(),
  {
    show: false,
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
    type: "number",
    isEdit: true
  },
  {
    prop: "number",
    label: "数量",
    type: "number",
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
import { putVoucher } from "@/api/purchase"
const formRules: FormRules = {
  payment_voucher: [{ required: true, trigger: "change", message: "请选择打款凭证" }],
  payment_time: [{ required: true, trigger: "change", message: "请选择打款时间" }]
}
const DEFAULT_FORM_DATA: any = {
  procure_id: "",
  payment_voucher: [],
  payment_time: ""
}
const formData = ref(cloneDeep(DEFAULT_FORM_DATA))
const formRef = ref<FormInstance | null>(null)
const btnOkLoading = ref<boolean>(false)
const emit = defineEmits(["update:show", "refresh"])
const handleOk = () => {
  formRef.value?.validate(async (valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    btnOkLoading.value = true
    const { payment_time, id, payment_voucher } = formData.value
    putVoucher({
      procure_id: id,
      payment_voucher,
      payment_time
    })
      .then(() => {
        ElMessage.success("操作成功")
        emit("update:show", false)
      })
      .finally(() => {
        btnOkLoading.value = false
      })
  })
}
//#endregion

// 打开
const allLoading = ref<boolean>(true)
const handleOpen = async () => {
  activeNames.value = [2]
  allLoading.value = true
  const id = props.currentObj.id
  flowArr.value = []
  flowActive.value = 0
  approvalStatusText.value = ""
  try {
    if (id) {
      await getSetps({
        id,
        type: 1
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    Object.assign(formData.value, props.currentObj)
    formData.value.payment_voucher = formData.value.payment_voucher || []
    allLoading.value = false
  }
}

// #region 详情
import { useFlow } from "@/hooks/useFlow"
const activeNames = ref<any>([2])
const { getSetps, flowArr, flowActive, approvalStatusText } = useFlow()
const showFlowDecArr = computed(() => {
  return flowArr.value.slice(1, -1)
})
const info1 = computed(() => {
  const { creator, amount, created_at, desc, phonenumber } = formData.value
  return [
    {
      label: "提交人",
      value: creator
    },
    {
      label: "联系方式",
      value: phonenumber
    },
    {
      label: "提交时间",
      value: created_at
    },
    {
      label: "采购金额",
      value: amount
    },
    {
      label: "申请说明",
      value: desc
    }
  ]
})
// #endregion

const resetForm = () => {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  formRef.value?.resetFields()
  emit("refresh")
}
</script>

<style lang="scss" scoped>
/* 样式 */
::v-deep(.el-descriptions__title) {
  font-weight: 500;
}
</style>
