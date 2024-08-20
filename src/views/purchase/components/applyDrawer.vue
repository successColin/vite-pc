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
      <el-form-item prop="amount" label="采购金额">
        <global-input :value="formData.amount" :disabled="true" placeholder="自动计算清单所填金额的和"></global-input>
      </el-form-item>
      <el-form-item prop="desc" label="申请说明">
        <global-input
          style="width: 100%"
          v-model:value="formData.desc"
          :disabled="readOnly"
          type="textarea"
        ></global-input>
      </el-form-item>
      <el-form-item prop="details" label="采购材料清单">
        <global-edit-table
          ref="editTableRef"
          v-model:tableValue="formData.details"
          :cloumnArr="cloumnArr"
          :rules="rules"
          :readOnly="readOnly"
        ></global-edit-table>
      </el-form-item>

      <el-row v-if="readOnly">
        <el-col :span="12">
          <el-form-item prop="creator" label="提交人">
            {{ formData.creator }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="created_at" label="提交时间">
            {{ formData.created_at }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="created_at" label="审批状态">
            {{ approvalStatusText || formData.approval_status_text }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </global-drawer>
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
import { editLaunchProcure } from "@/api/purchase"
const formRules: FormRules = {
  order_id: [{ required: true, trigger: "change", message: "请选择关联维修单" }],
  amount: [{ required: false, trigger: "change", message: "请填写采购材料清单" }],
  desc: [{ required: true, trigger: "change", message: "请填写申请说明" }],
  details: [{ required: true, trigger: "change", message: "请输入采购材料清单" }]
}
const DEFAULT_FORM_DATA: any = {
  order_id: "",
  amount: undefined,
  desc: "",
  details: []
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
    editLaunchProcure(formData.value)
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
        type: 1
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    Object.assign(formData.value, props.currentObj)
    allLoading.value = false
  }
}

const resetForm = () => {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  formRef.value?.resetFields()
  emit("refresh")
}

let title = computed(() => {
  return formData.value.id === undefined ? "发起申请" : "查看详情"
})

// 审批流
import { useFlow } from "@/hooks/useFlow"
const { getSetps, flowArr, flowActive, approvalStatusText } = useFlow()

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
