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
        <el-card style="margin-top: 10px" shadow="never">
          <template #header>
            <div class="card-header">
              <span>进度款支付申请</span>
            </div>
          </template>
          <global-descriptions :arr="info1"></global-descriptions>
          <global-descriptions :arr="info2"></global-descriptions>
        </el-card>

        <flow-item class="m-t-1" v-for="(v, i) in showFlowDecArr" :key="i" :item="v"></flow-item>
      </el-collapse-item>
      <el-collapse-item title="打款凭证" :name="2">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="auto">
          <el-form-item prop="pay_invoice" label="打款凭证">
            <global-upload v-model:fileList="formData.pay_invoice" isCloud></global-upload>
          </el-form-item>
          <el-form-item prop="pay_time" label="打款时间">
            <el-date-picker
              style="width: 370px"
              v-model="formData.pay_time"
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
import flowItem from "@/views/purchase/components/flowItem.vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { cloneDeep } from "lodash-es"

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

//#region 表单
import { repairPayPayment } from "@/api/outRepair"
const formRules: FormRules = {
  pay_invoice: [{ required: true, trigger: "change", message: "请选择打款凭证" }],
  pay_time: [{ required: true, trigger: "change", message: "请选择打款时间" }]
}
const DEFAULT_FORM_DATA: any = {
  id: undefined,
  pay_time: "",
  pay_invoice: [],
  type: 1
}
const formData = ref(cloneDeep(DEFAULT_FORM_DATA))
const formRef = ref<FormInstance | null>(null)
const btnOkLoading = ref<boolean>(false)
const emit = defineEmits(["update:show", "refresh"])
const handleOk = () => {
  formRef.value?.validate(async (valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    btnOkLoading.value = true
    const { pay_time, id, pay_invoice } = formData.value
    repairPayPayment({
      id,
      pay_invoice,
      pay_time,
      type: 1
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
const allLoading = ref<boolean>(false)
const handleOpen = async () => {
  allLoading.value = true
  const id = props.currentObj.id
  flowArr.value = []
  flowActive.value = 0
  approvalStatusText.value = ""
  try {
    if (id) {
      await getSetps({
        id,
        type: 3
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    Object.assign(formData.value, props.currentObj)
    formData.value.pay_invoice = formData.value.pay_invoice || []
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
  const {
    creator,
    creator_mobile,
    created_at,
    order_no,
    all_money,
    pay_amount,
    project_unit_name,
    bank_account,
    bank
  } = formData.value
  return [
    {
      label: "提交人",
      value: creator
    },
    {
      label: "联系方式",
      value: creator_mobile
    },
    {
      label: "提交时间",
      value: created_at
    },
    {
      label: "关联报修单",
      value: order_no
    },
    {
      label: "维修单位",
      value: project_unit_name
    },
    {
      label: "合同金额",
      value: all_money
    },
    {
      label: "申请支付金额",
      value: pay_amount
    },
    {
      label: "银行账户信息",
      value: `${bank} / ${bank_account}`
    }
  ]
})
const info2 = computed(() => {
  const { invoice } = formData.value
  return [
    {
      label: "上传发票",
      value: invoice,
      type: 1
    }
  ]
})
// #endregion

const resetForm = () => {
  activeNames.value = [2]
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  formRef.value?.resetFields()
  emit("refresh")
}
</script>

<style lang="scss" scoped>
/* 样式 */
::v-deep(.el-descriptions__title) {
  font-weight: 600;
}

::v-deep(.el-card__header) {
  padding: 10px;
}
::v-deep(.el-card__body) {
  padding: 10px 10px 0;
}
::v-deep(.el-card__header) {
  font-weight: 600;
}
</style>
