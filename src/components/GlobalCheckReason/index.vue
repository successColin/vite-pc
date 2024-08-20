<template>
  <global-dialog
    title="派单"
    width="40%"
    :show="show"
    :loading="btnOkLoading"
    @closed="resetForm"
    @ok="handleOk"
    @open="handleOpen"
    @update:show="emit('update:show', false)"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="auto">
      <el-form-item prop="name" label="出入库类型名称">
        <global-input v-model:value="formData.name"></global-input>
      </el-form-item>
    </el-form>
  </global-dialog>
</template>

<script setup lang="ts">
import { editSetOrder } from "@/api/repair"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { cloneDeep } from "lodash-es"
import { ref } from "vue"

const props = withDefaults(
  defineProps<{
    show: boolean
  }>(),
  {
    show: false
  }
)

// 表单
const DEFAULT_FORM_DATA: any = {
  id: undefined,
  name: ""
}
const formData = ref(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules = {
  name: [{ required: true, trigger: "blue", message: "请输入出入库类型名称" }]
}

// 方法
const emit = defineEmits(["update:show", "refresh"])

// 点击ok
const btnOkLoading = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const handleOk = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    btnOkLoading.value = true
    const params = {
      ...formData.value,
      category_id: Array.isArray(formData.value.category_id)
        ? formData.value.category_id[formData.value.category_id.length - 1]
        : formData.value.category_id
    }
    editSetOrder(params)
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

// 打开弹窗
const handleOpen = () => {
  formRef.value?.clearValidate()
}
// 关闭弹窗
const resetForm = () => {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped></style>
