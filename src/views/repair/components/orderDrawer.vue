<template>
  <global-drawer
    :show="show"
    :loading="btnOkLoading"
    :title="title"
    @open="handleOpen"
    @ok="handleOk"
    @closed="resetForm"
    @update:show="emit('update:show', false)"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="auto">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="is_urgent" label="紧急程度">
            <global-select line v-model:value="formData.is_urgent" :option="IsUrgentType"></global-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="is_man_made" label="损害性质">
            <global-select line v-model:value="formData.is_man_made" :option="IsManMade"></global-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="category_id" label="报修类目">
            <el-cascader
              style="width: 100%"
              v-model="formData.category_id"
              :options="tableOptions"
              :props="{
                expandTrigger: 'hover' as const,
                checkStrictly: true
              }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="repair_area_id" label="报修区域">
            <global-select
              line
              v-model:value="formData.repair_area_id"
              :option="repairAreaListArr"
              @change="handleChangeRepairArea"
            ></global-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="build_floor" label="报修楼层">
            <global-select
              line
              :disabled="buildFloorDisabled"
              v-model:value="formData.build_floor"
              :option="buildFloorArr"
            ></global-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item prop="repair_address" label="详细地址">
        <el-input
          v-model="formData.repair_address"
          :autosize="{ minRows: 3, maxRows: 4 }"
          type="textarea"
          placeholder="请输入"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item prop="desc" label="故障描述">
        <el-input
          v-model="formData.desc"
          :autosize="{ minRows: 3, maxRows: 4 }"
          type="textarea"
          placeholder="请输入"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="报修图片/视频">
        <global-upload :limit="3" v-model:fileList="formData.file" :isCloud="true"></global-upload>
      </el-form-item>

      <!-- 报修图片/视频 -->
      <div style="color: rgb(114, 118, 123); font-size: 15px; font-weight: bold; margin-bottom: 15px">备用联系人</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名">
            <global-input line v-model:value="formData.contact_name"></global-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="contacts_info" label="联系方式">
            <global-input line v-model:value="formData.contacts_info"></global-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </global-drawer>
</template>

<script setup lang="ts">
import { editSetOrder } from "@/api/repair"
import { getMaintenanceList, getRepairAreaList } from "@/api/system"
import { IsManMade, IsUrgentType } from "@/config/dictionary"
import { transformToTree } from "@/utils"
import { isPhoneNumber } from "@/utils/validate"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { cloneDeep } from "lodash-es"

const props = withDefaults(
  defineProps<{
    show: boolean
    currentObj: any
  }>(),
  {
    show: false,
    currentObj: {}
  }
)

// 报修类目
const tableOptions = ref<Array<any>>([])
const getListDate = async () => {
  const { data } = await getMaintenanceList()
  tableOptions.value = transformToTree(data)
}

// 报修楼层
const buildFloorDisabled = ref<boolean>(true)
const floorMaxI = ref(0)
const buildFloorArr = computed(() => {
  return generateArray(floorMaxI.value)
})
const generateArray = (n: number) => {
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push({
      value: i + 1,
      label: i + 1 + "楼"
    })
  }
  return arr
}

// 报修区域
const repairAreaListArr = ref([])
const getRepairAreaListArr = async () => {
  const { data } = await getRepairAreaList()
  repairAreaListArr.value = data.map((item: any) => {
    return {
      value: item.id,
      label: item.repair_address,
      build_floor: item.build_floor
    }
  })
}

// 报修楼层
const handleChangeRepairArea = (v: any, build_floor: number) => {
  if (v) {
    buildFloorDisabled.value = false
    const obj = repairAreaListArr.value.find((item: any) => item.value === v) as any
    if (obj) {
      floorMaxI.value = obj?.build_floor
      formData.value.build_floor = build_floor || 1
    }
  } else {
    buildFloorDisabled.value = true
    formData.value.build_floor = undefined
  }
}

onMounted(() => {
  getListDate()
  getRepairAreaListArr()
})

const validateIphone = (rule: any, value: any, callback: any) => {
  if (isPhoneNumber(formData.value.contacts_info) || formData.value.contacts_info === "") {
    callback()
  }
  callback(new Error("请输入正确的手机号"))
}

const formRules: FormRules = {
  is_urgent: [{ required: true, trigger: "change", message: "请选择紧急程度" }],
  is_man_made: [{ required: true, trigger: "change", message: "请选择损坏性质" }],
  category_id: [{ required: true, trigger: "change", message: "请选择报修类目" }],
  repair_area_id: [{ required: true, trigger: "change", message: "请选择报修区域" }],
  desc: [{ required: true, trigger: "change", message: "请填写故障描述" }],
  build_floor: [{ required: true, trigger: "change", message: "请选择报修区域" }],
  repair_address: [{ required: true, trigger: "blur", message: "请填写详细地址" }],
  contacts_info: [{ required: false, trigger: "blur", validator: validateIphone }]
}

const DEFAULT_FORM_DATA: any = {
  id: undefined,
  is_urgent: 0,
  is_man_made: 0,
  category_id: "",
  repair_area_id: "",
  build_floor: undefined,
  repair_address: "",
  desc: "",
  file: [],
  contact_name: "",
  contacts_info: ""
}
const formData = ref(cloneDeep(DEFAULT_FORM_DATA))

const formRef = ref<FormInstance | null>(null)

const btnOkLoading = ref<boolean>(false)
const emit = defineEmits(["update:show", "refresh"])
const handleOk = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    btnOkLoading.value = true
    const params = {
      ...formData.value,
      source_type: 2,
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

const resetForm = () => {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  formRef.value?.resetFields()
}
const handleOpen = () => {
  Object.assign(formData.value, props.currentObj)
  floorMaxI.value = props.currentObj
  handleChangeRepairArea(props.currentObj.repair_area_id, props.currentObj.build_floor)
}

let title = computed(() => {
  return formData.value.id === undefined ? "新增" : "修改"
})
</script>

<style lang="scss" scoped>
/* 样式 */
</style>
