<template>
  <global-drawer
    :show="show"
    :loading="btnOkLoading"
    :title="title"
    @ok="handleOk"
    @closed="resetForm"
    @update:show="emit('update:show', false)"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="auto">
      <el-form-item prop="title" label="标题">
        <global-input v-model:value="formData.title" style="width: 100%"></global-input>
      </el-form-item>
      <el-form-item prop="content" label="公告内容">
        <global-editor v-model:value="formData.content" height="350px" />
      </el-form-item>
      <el-form-item prop="file" label="上传文件">
        <global-upload v-model:fileList="formData.file"></global-upload>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="publisher" label="发布人">
            <global-input v-model:value="formData.publisher"></global-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="scopeVal" label="发布范围">
            <el-button type="primary" v-model:scopeVal="formData.scopeVal" @click="handleScope">发布范围</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="status" label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio :value="1">显示</el-radio>
              <el-radio :value="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="force_read" label="是否为强制阅读">
            <el-radio-group v-model="formData.force_read">
              <el-radio :value="1">是</el-radio>
              <el-radio :value="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </global-drawer>
  <release-scope
    v-model:show="showScope"
    :scopeType="scopeType"
    :scopeVal="formData.scopeVal"
    @getStudents="getStudents"
    @getTeachers="getTeachers"
  />
</template>

<script setup lang="ts">
import { editNotice } from "@/api/notice"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { cloneDeep } from "lodash-es"
import releaseScope from "./releaseScope.vue"

const props = withDefaults(
  defineProps<{
    show: boolean
    currentObj?: Record<string, any>
  }>(),
  {
    show: false,
    currentObj: () => ({})
  }
)

const formRules: FormRules = {
  title: [{ required: true, trigger: "change", message: "请输入标题" }],
  content: [{ required: true, trigger: "change", message: "请输入内容" }],
  file: [{ required: false, trigger: "change", message: "请上传文件" }],
  publisher: [{ required: true, trigger: "change", message: "请输入发布人名称" }],
  scopeVal: [{ required: true, trigger: "change", message: "请选择发布范围" }],
  status: [{ required: true, trigger: "change", message: "请选择状态" }],
  force_read: [{ required: true, trigger: "change", message: "请选择是否强制阅读" }]
}

const DEFAULT_FORM_DATA: any = {
  id: undefined,
  title: "",
  publisher: "",
  status: 1,
  force_read: 0,
  content: "",
  file: [],
  range_student_grade_ids: "",
  range_teacher_dep_ids: "",
  scopeVal: []
}
const formData = ref(cloneDeep(DEFAULT_FORM_DATA))
const formRef = ref<FormInstance | null>(null)
const btnOkLoading = ref<boolean>(false)
const emit = defineEmits(["update:show", "refresh"])
const handleOk = () => {
  console.log(formData.value)
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    btnOkLoading.value = true
    editNotice({
      ...formData.value
    })
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

// 发布范围
let showScope = ref<boolean>(false)
let scopeType = ref<number>(1)
const handleScope = (row: any) => {
  showScope.value = true
  let val = ""
  if (formData.value.range_student_grade_ids) {
    scopeType.value = 1
    val = formData.value.range_student_grade_ids
  } else if (formData.value.range_teacher_dep_ids) {
    scopeType.value = 2
    val = formData.value.range_teacher_dep_ids
  }
  formData.value.scopeVal = val === "" ? [] : val.split(",").map((v: any) => (v = Number(v)))
}
const getStudents = (val: any) => {
  formData.value.scopeVal = val
  formData.value.range_student_grade_ids = val.join(",")
  formData.value.range_teacher_dep_ids = ""
}
const getTeachers = (val: any) => {
  formData.value.scopeVal = val
  formData.value.range_student_grade_ids = ""
  formData.value.range_teacher_dep_ids = val.join(",")
}

const resetForm = () => {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  formRef.value?.resetFields()
}

let title = computed(() => {
  return formData.value.id === undefined ? "新增" : "修改"
})

watch(
  () => props.show,
  (v) => {
    if (v && JSON.stringify(props.currentObj) !== "{}") {
      Object.assign(formData.value, props.currentObj)
      if (formData.value.range_student_grade_ids) {
        formData.value.scopeVal = formData.value.range_student_grade_ids.split(",").map((v: any) => (v = Number(v)))
      } else if (formData.value.range_teacher_dep_ids) {
        formData.value.scopeVal = formData.value.range_teacher_dep_ids.split(",").map((v: any) => (v = Number(v)))
      }
    }
  }
)
</script>

<style lang="scss" scoped>
/* 样式 */
</style>
