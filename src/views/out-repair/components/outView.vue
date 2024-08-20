<template>
  <global-drawer
    :show="show"
    :title="title"
    :isOk="false"
    :allLoading="allLoading"
    @closed="resetForm"
    @update:show="emit('update:show', false)"
  >
    <global-flow :flowArr="flowArr" :flowActive="flowActive"></global-flow>
    <el-collapse :model-value="activeNames">
      <el-collapse-item :title="v.title" :name="v.name" v-for="(v, i) in currentCollapseArr" :key="i">
        <template v-if="v.name === 1">
          <global-descriptions :arr="info1"></global-descriptions>
          <global-descriptions :column="1" :arr="info2"></global-descriptions>
        </template>
        <template v-if="v.name === 2">
          <global-descriptions :column="4" :arr="info3"></global-descriptions>
          <global-descriptions :column="1" :arr="info4"></global-descriptions>
        </template>
      </el-collapse-item>
    </el-collapse>
  </global-drawer>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    show: boolean
    currentObj: any
    title: string
    activeNames?: Array<number>
    showItem?: Array<number>
    flowArr: Array<any>
    flowActive: number
    allLoading: boolean
  }>(),
  {
    show: false,
    title: "",
    currentObj: {},
    activeNames: () => [1],
    showItem: () => [],
    flowArr: () => [],
    flowActive: 0,
    allLoading: false
  }
)

const collapseArr = [
  {
    title: "维修提报",
    name: 1
  },
  {
    title: "外部维修信息",
    name: 2
  }
]

const currentCollapseArr = computed(() => {
  return collapseArr.filter((v) => props.showItem.includes(v.name))
})

import { IsNo, IsUrgentType } from "@/config/dictionary"
// 1
const info1 = computed(() => {
  const { submit_user_name, submit_user_mobile, created_at, repairer, repair_area, category_name, is_urgent, record } =
    props.currentObj
  const { user_name, phonenumber } = repairer || {}
  const { repair_address } = repair_area || {}
  const { is_out_repair } = record || {}
  return [
    {
      label: "提交人",
      value: submit_user_name
    },
    {
      label: "提交人手机号",
      value: submit_user_mobile
    },
    {
      label: "提交时间",
      value: created_at
    },

    {
      label: "维修人",
      value: user_name
    },
    {
      label: "维修人手机号",
      value: phonenumber
    },
    {
      label: "维修地点",
      value: repair_address
    },

    {
      label: "维修类目",
      value: category_name
    },
    {
      label: "紧急程度",
      value: IsUrgentType.find((v: any) => v.value === is_urgent)?.label
    },
    {
      label: "是否校外维修",
      value: IsNo.find((v: any) => v.value === is_out_repair)?.label
    }
  ]
})
const info2 = computed(() => {
  const { record } = props.currentObj
  const { after_repair_file, remark } = record || {}
  return [
    {
      label: "维修单位",
      value: remark
    },
    {
      label: "维修预算表",
      value: after_repair_file,
      type: 1
    },
    {
      label: "维修报价单",
      value: after_repair_file,
      type: 1
    },
    {
      label: "合同金额",
      value: remark
    },
    {
      label: "合同金额",
      value: remark
    }
  ]
})
// 2
const info3 = computed(() => {
  const { submit_user_name, submit_user_mobile } = props.currentObj
  return [
    {
      label: "维修单位",
      value: submit_user_name
    },
    {
      label: "合同金额",
      value: submit_user_mobile
    }
  ]
})
const info4 = computed(() => {
  const { record, created_at } = props.currentObj
  const { after_repair_file } = record || {}
  return [
    {
      label: "维修周期",
      value: `${created_at || ""} 到 ${created_at || ""}`
    },
    {
      label: "维修预算表",
      value: after_repair_file,
      type: 1
    },
    {
      label: "维修报价单",
      value: after_repair_file,
      type: 1
    }
  ]
})

const emit = defineEmits(["update:show", "refresh"])
const resetForm = () => {
  console.log("closed")
  emit("refresh")
}
</script>
