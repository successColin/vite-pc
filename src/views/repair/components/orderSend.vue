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
      <el-form-item prop="name" label="派单人">
        {{ formData.name }}
      </el-form-item>
      <el-form-item prop="group" label="派单班组">
        <global-checkbox-btn
          v-model:value="formData.group"
          :option="repairGroupArr"
          @change="handleChangeGroup"
        ></global-checkbox-btn>
      </el-form-item>

      <el-form-item prop="repair_user_id" label="派单对象">
        <global-select v-model:value="formData.repair_user_id" :option="repairAllUserArr"></global-select>
      </el-form-item>
      <el-form-item prop="name" label="派单对象状态" :style="repairUserStatus === '维修中' ? 'color: red' : ''">
        {{ repairUserStatus }}
      </el-form-item>
    </el-form>
  </global-dialog>
</template>

<script setup lang="ts">
import { getRepairUserList, setDispatchOrder } from "@/api/repair"
import { useUserStore } from "@/store/modules/user"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { cloneDeep } from "lodash-es"

const props = withDefaults(
  defineProps<{
    show: boolean
    currentId: number
  }>(),
  {
    show: false
  }
)

// 获取班组
const repairUserList = ref<any>([])
const repairGroupArr = ref<any>([])
const repairAllUserArr = ref<any>([])
const repairAllUserArrCopy = ref<any>([])
const getRepairUserData = async () => {
  repairGroupArr.value = []
  repairAllUserArr.value = []
  repairAllUserArrCopy.value = []
  const { data } = await getRepairUserList()
  data.forEach((item: any) => {
    if (item.user_list.length) {
      const { id: value, name: label } = item
      repairGroupArr.value.push({
        label,
        value
      })
      item.user_list.forEach((user: any) => {
        repairAllUserArr.value.push({
          label: user.nick_name,
          value: user.id,
          status: user.status
        })
      })
    }
  })
  repairAllUserArrCopy.value = cloneDeep(repairAllUserArr.value)
  repairUserList.value = data
}

// 班组选择换用户
const handleChangeGroup = (val: any) => {
  if (!val.length) return (repairAllUserArr.value = repairAllUserArrCopy.value)
  repairAllUserArr.value = []
  repairUserList.value.forEach((item: any) => {
    if (val.includes(item.id)) {
      item.user_list.forEach((user: any) => {
        repairAllUserArr.value.push({
          label: user.nick_name,
          value: user.id,
          status: user.status
        })
      })
    }
  })
}

// 派单对象状态
const repairUserStatus = computed(() => {
  const { repair_user_id } = formData.value
  const user = repairAllUserArr.value.find((item: any) => item.value === repair_user_id)
  if (!user) return "请选择派单对象"
  return user.status === 0 ? "空闲" : user.status === 1 ? "维修中" : ""
})

// 表单
const userStore = useUserStore()
const DEFAULT_FORM_DATA: any = {
  id: undefined,
  name: userStore.username,
  group: [],
  repair_user_id: undefined
}
const formData = ref(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules = {
  repair_user_id: [{ required: true, trigger: "change", message: "请选择派单对象" }]
}

// 方法
const emit = defineEmits(["update:show", "refresh"])

// 点击ok
const btnOkLoading = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const handleOk = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return
    btnOkLoading.value = true
    setDispatchOrder({
      ...formData.value,
      id: props.currentId
    })
      .then(() => {
        ElMessage.success("派单成功")
        emit("update:show", false)
        emit("refresh")
      })
      .finally(() => {
        btnOkLoading.value = false
      })
  })
}

// 打开弹窗
const handleOpen = () => {}
// 关闭弹窗
const resetForm = () => {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  formRef.value?.resetFields()
}

onMounted(() => {
  getRepairUserData()
})
</script>

<style lang="scss" scoped></style>
