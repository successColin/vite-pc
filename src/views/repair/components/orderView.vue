<template>
  <!-- @ok="handleOk"
    @open="handleOpen" -->

  <global-drawer
    :show="show"
    :title="title"
    @open="handleOpen"
    @update:show="emit('update:show', false)"
    :isOk="false"
    @closed="resetForm"
  >
    <el-collapse :model-value="activeNames">
      <el-collapse-item :title="v.title" :name="v.name" v-for="(v, i) in currentCollapseArr" :key="i">
        <template v-if="v.name === 1">
          <global-descriptions :column="4" :arr="info1"></global-descriptions>
          <global-descriptions :arr="info2"></global-descriptions>
          <global-descriptions :arr="info3"></global-descriptions>
          <global-descriptions :arr="info4"></global-descriptions>
          <div style="color: rgb(48, 49, 51); font-size: 15px; font-weight: 500; margin-bottom: 10px">备用联系人</div>
          <global-descriptions :column="4" :arr="info5"></global-descriptions>
        </template>
        <template v-if="v.name === 2">
          <global-descriptions :column="4" :arr="info6"></global-descriptions>
          <el-table v-if="tablePartListData.length" border :data="tablePartListData" style="width: 100%">
            <el-table-column prop="part_name" label="材料名称" />
            <el-table-column prop="number" label="材料数量" />
            <el-table-column prop="price" label="单价（元）" />
            <el-table-column prop="all_price" label="小计（元）" />
            <el-table-column label="出库状态">
              <template #default="scope">
                <span>{{ scope.row.part_source === 1 ? "学校库存出库" : "校外采购" }}</span>
              </template>
            </el-table-column>
          </el-table>
          <global-descriptions :arr="info7"></global-descriptions>
          <global-descriptions :arr="info8"></global-descriptions>
        </template>
        <template v-if="v.name === 3">
          <global-descriptions :arr="info9"></global-descriptions>
        </template>
        <template v-if="v.name === 4">
          <global-descriptions :arr="info10"></global-descriptions>
          <global-descriptions :arr="info11"></global-descriptions>
          <global-descriptions :arr="info12"></global-descriptions>
        </template>
        <template v-if="v.name === 5">
          <global-descriptions :arr="info13"></global-descriptions>
          <global-descriptions :arr="info14"></global-descriptions>
          <global-descriptions :arr="info15"></global-descriptions>
        </template>
        <template v-if="v.name === 6">
          <global-descriptions :arr="info16"></global-descriptions>
          <global-descriptions :arr="info17"></global-descriptions>
          <global-descriptions :arr="info18"></global-descriptions>
          <global-descriptions :arr="info19"></global-descriptions>
        </template>
      </el-collapse-item>
    </el-collapse>

    <!-- 待验收 -->
    <div v-if="viewType === 1">
      <div class="formTitle">验收信息</div>
      <el-form
        ref="formCheckRef"
        :model="formCheckData"
        :rules="formCheckRules"
        label-position="left"
        label-width="auto"
        style="margin-top: 20px"
      >
        <el-form-item prop="check_reason" label="理由">
          <global-input v-model:value="formCheckData.check_reason" type="textarea"></global-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 待评价 -->
    <div v-if="viewType === 2">
      <div class="formTitle">评价信息</div>
      <el-form
        ref="formEvaluateRef"
        :model="formEvaluateData"
        :rules="formEvaluateRules"
        label-position="left"
        label-width="auto"
        style="margin-top: 20px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item prop="overall_star" label="总评分">
              <global-rate v-model:value="formEvaluateData.overall_star"></global-rate>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="quality_star" label="维修质量">
              <global-rate v-model:value="formEvaluateData.quality_star"></global-rate>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="service_star" label="服务态度">
              <global-rate v-model:value="formEvaluateData.service_star"></global-rate>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="time_star" label="接/派单时数">
              <global-rate v-model:value="formEvaluateData.time_star"></global-rate>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="助力校园报修金点子" label-position="top">
          <global-input v-model:value="formEvaluateData.remark" type="textarea"></global-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 投诉处理 -->
    <div v-if="viewType === 3">
      <el-form
        ref="formComplainRef"
        :model="formComplainData"
        :rules="formComplainRules"
        label-position="left"
        label-width="auto"
        style="margin-top: 20px"
      >
        <el-form-item prop="handle_content" label="处理投诉结果反馈">
          <global-input v-model:value="formComplainData.handle_content" type="textarea"></global-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 赔付单 -->
    <div v-if="viewType === 5">
      <div class="formTitle">赔付单信息</div>
      <el-form
        ref="formCompensateRef"
        :model="formCompensateData"
        :rules="formCompensateRules"
        label-position="left"
        label-width="auto"
        style="margin-top: 20px"
      >
        <el-form-item prop="image" label="图片上传">
          <global-upload v-model:fileList="formCompensateData.image"></global-upload>
        </el-form-item>
        <el-form-item prop="repair_list" label="维修清单上传">
          <global-upload v-model:fileList="formCompensateData.repair_list"></global-upload>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="payer_name" label="赔付人姓名">
              <global-input v-model:value="formCompensateData.payer_name"></global-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="payer_num" label="赔付人学/工号">
              <global-input v-model:value="formCompensateData.payer_num"></global-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="payer_phone" label="赔付人电话">
              <global-input v-model:value="formCompensateData.payer_phone"></global-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="amount" label="支付金额">
              <global-input v-model:value="formCompensateData.amount"></global-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="color: #606266; font-size: 16px">同步抄送给</div>
        <el-divider />
        <el-row>
          <el-col :span="12">
            <el-form-item prop="cc_name" label="在校老师名称">
              <global-input v-model:value="formCompensateData.cc_name"></global-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="cc_num" label="在校老师学/工号">
              <global-input v-model:value="formCompensateData.cc_num"></global-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="cc_phone" label="在校老师电话">
              <global-input v-model:value="formCompensateData.cc_phone"></global-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 材料审核 -->
    <div v-if="viewType === 4 && isMaterials">
      <div class="formTitle" style="margin-bottom: 20px">材料审核资料</div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="auto">
        <el-form-item prop="amount" label="采购金额">
          <global-input :value="formData.amount" :disabled="true" placeholder="自动计算清单所填金额的和"></global-input>
        </el-form-item>
        <el-form-item prop="desc" label="申请说明">
          <global-input style="width: 100%" v-model:value="formData.desc" type="textarea"></global-input>
        </el-form-item>
        <el-form-item prop="details" label="采购材料清单">
          <global-edit-table
            ref="editTableRef"
            v-model:tableValue="formData.details"
            :cloumnArr="cloumnArr"
            :rules="rules"
            :isNoBtn="false"
          ></global-edit-table>
        </el-form-item>
      </el-form>
    </div>

    <template #footerBtn v-if="viewType === 1">
      <el-button type="primary" @click="handleCheckOk">通过</el-button>
      <el-button type="danger" @click="handleCheckNo">驳回</el-button>
    </template>
    <template #footerBtn v-if="viewType === 2">
      <el-button type="primary" @click="handleEvaluateOk">提交</el-button>
    </template>
    <template #footerBtn v-if="viewType === 3">
      <el-button type="primary" @click="handleComplain">提交</el-button>
    </template>
    <template #footerBtn v-if="viewType === 4">
      <el-button type="primary" @click="handleAuditOk">通过</el-button>
      <el-button type="danger" @click="handleAuditNo">驳回</el-button>
    </template>
    <template #footerBtn v-if="viewType === 5">
      <el-button type="primary" @click="handleCompensateOk">通过</el-button>
      <el-button type="danger" @click="handleCompensateNo">驳回</el-button>
    </template>
  </global-drawer>
</template>

<script lang="ts" setup>
import { auditProcessList, checkOrder, commentOrder, referOrder } from "@/api/repair";
import { IsManMade, IsNo, IsUrgentType } from "@/config/dictionary";
import { useBottom } from "@/hooks/useBottom";
import { type FormInstance, type FormRules, ElMessage } from "element-plus";
const props = withDefaults(
  defineProps<{
    show: boolean
    currentObj: any
    activeNames?: Array<number>
    showItem?: Array<number>
    title?: string
    viewType?: number
    isMaterials?: boolean
  }>(),
  {
    show: false,
    currentObj: {},
    activeNames: () => [1],
    showItem: () => [1, 2, 3, 4, 5, 6],
    title: "查看",
    isMaterials: false
  }
)

const collapseArr = [
  {
    title: "报修信息",
    name: 1
  },
  {
    title: "维修员填写信息",
    name: 2
  },
  {
    title: "验收信息",
    name: 3
  },
  {
    title: "评价信息",
    name: 4
  },
  {
    title: "投诉信息",
    name: 5
  },
  {
    title: "赔付信息",
    name: 6
  }
]

const currentCollapseArr = computed(() => {
  return collapseArr.filter((v) => props.showItem.includes(v.name))
})

// 1
const info1 = computed(() => {
  const {
    is_man_made,
    build_floor,
    order_no,
    submit_user_name,
    submit_user_mobile,
    category_name,
    is_urgent,
    repair_area_name
  } = props.currentObj
  return [
    {
      label: "报修单号",
      value: order_no
    },
    {
      label: "报修人",
      value: submit_user_name
    },
    {
      label: "报修人电话",
      value: submit_user_mobile
    },
    {
      label: "报修类目",
      value: category_name
    },
    {
      label: "紧急程度",
      value: IsUrgentType.find((v: any) => v.value === is_urgent)?.label
    },
    {
      label: "损坏性质",
      value: IsManMade.find((v: any) => v.value === is_man_made)?.label
    },

    {
      label: "报销区域",
      value: repair_area_name
    },
    {
      label: "报修楼层",
      value: build_floor
    }
  ]
})
const info2 = computed(() => {
  const { repair_address } = props.currentObj
  return [
    {
      label: "详细地址",
      value: repair_address
    }
  ]
})
const info3 = computed(() => {
  const { desc } = props.currentObj
  return [
    {
      label: "故障描述",
      value: desc
    }
  ]
})
const info4 = computed(() => {
  const { file } = props.currentObj
  return [
    {
      label: "报修图片/视频",
      value: file,
      type: 1
    }
  ]
})
const info5 = computed(() => {
  const { contact_name, contacts_info, status_text } = props.currentObj
  return [
    {
      label: "姓名",
      value: contact_name
    },
    {
      label: "联系方式",
      value: contacts_info
    },
    {
      label: "状态",
      value: status_text
    }
  ]
})

// 2
const info6 = computed(() => {
  const { record = {} } = props.currentObj
  const { is_man_made, has_payer, payer_name, payer_num, payer_phone, is_out_repair, need_part } = record || {}
  return [
    {
      label: "判定损坏性质",
      value: IsManMade.find((v: any) => v.value === is_man_made)?.label
    },
    {
      label: "是否确定赔付人",
      value: IsNo.find((v: any) => v.value === has_payer)?.label
    },
    {
      label: "赔付人姓名",
      value: payer_name
    },
    {
      label: "赔付人学/工号",
      value: payer_num
    },
    {
      label: "赔付人电话",
      value: payer_phone
    },
    {
      label: "是否需要校外维修",
      value: IsNo.find((v: any) => v.value === is_out_repair)?.label
    },
    {
      label: "是否缺少配件材料",
      value: IsNo.find((v: any) => v.value === need_part)?.label
    }
  ]
})
const tablePartListData = computed(() => {
  return props.currentObj.part_list || []
})
const info7 = computed(() => {
  return [
    {
      label: "上传图片/视频",
      value: props.currentObj?.record?.after_repair_file,
      type: 1
    }
  ]
})
const info8 = computed(() => {
  return [
    {
      label: "维修备注",
      value: props.currentObj?.record?.remark
    }
  ]
})

// 3
const info9 = computed(() => {
  const { check_content, check_status } = props.currentObj?.record || {}
  return [
    {
      label: "验收信息",
      value: check_status === 2 ? "验收通过" : check_status === -1 ? `验收不通过：${check_content || "无"}` : "待验收"
    }
  ]
})

// 4
const info10 = computed(() => {
  const { overall_star, quality_star } = props.currentObj?.comment_list || {}
  return [
    {
      label: "总评分",
      value: overall_star,
      type: 2
    },
    {
      label: "维修质量",
      value: quality_star,
      type: 2
    }
  ]
})
const info11 = computed(() => {
  const { service_star, time_star } = props.currentObj?.comment_list || {}
  return [
    {
      label: "服务态度",
      value: service_star,
      type: 2
    },
    {
      label: "接/派单时效",
      value: time_star,
      type: 2
    }
  ]
})

const info12 = computed(() => {
  const { remark } = props.currentObj?.comment_list || {}
  return [
    {
      label: "助力校园报修金点子",
      value: remark
    }
  ]
})

// 5
const info13 = computed(() => {
  return [
    {
      label: "投诉类型",
      value: props.currentObj?.refer_list?.refer_type_name
    }
  ]
})
const info14 = computed(() => {
  return [
    {
      label: "投诉照片/视频",
      value: props.currentObj?.refer_list?.file,
      type: 1
    }
  ]
})
const info15 = computed(() => {
  return [
    {
      label: "投诉详情",
      value: props.currentObj?.refer_list?.refer_content
    }
  ]
})

// 6
const info16 = computed(() => {
  return [
    {
      label: "图片上传",
      value: props.currentObj?.pay_info?.image,
      type: 1
    }
  ]
})
const info17 = computed(() => {
  return [
    {
      label: "维修清单上传",
      value: props.currentObj?.pay_info?.repair_list,
      type: 1
    }
  ]
})
const info18 = computed(() => {
  return [
    {
      label: "赔付人姓名",
      value: props.currentObj?.pay_info?.payer_name
    },
    {
      label: "赔付人学/工号",
      value: props.currentObj?.pay_info?.payer_name
    },
    {
      label: "赔付人电话",
      value: props.currentObj?.pay_info?.payer_phone
    }
  ]
})
const info19 = computed(() => {
  return [
    {
      label: "抄送人老师姓名",
      value: props.currentObj?.pay_info?.cc_name
    },
    {
      label: "抄送人老师学/工号",
      value: props.currentObj?.pay_info?.cc_name
    },
    {
      label: "抄送人老师电话",
      value: props.currentObj?.pay_info?.cc_phone
    }
  ]
})

//#region 审核
// -----------------表单
const formRules: FormRules = {
  order_id: [{ required: true, trigger: "change", message: "请选择关联维修单" }],
  amount: [{ required: false, trigger: "change", message: "请填写采购材料清单" }],
  desc: [{ required: true, trigger: "change", message: "请填写申请说明" }],
  details: [{ required: true, trigger: "change", message: "请输入采购材料清单" }]
}
const SPDEFAULT_FORM_DATA: any = {
  amount: undefined,
  desc: "",
  details: []
}
const rules = {
  price: [{ required: true, type: "number", min: 0.1, max: 100000, message: "请输入单价（元）" }]
}
const cloumnArr = [
  {
    prop: "part_name",
    label: "材料名称"
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
    type: "number"
  },
  {
    prop: "all_price",
    label: "小计（元）",
    compute: (row: any) => {
      if (!row.price || !row.price) return 0
      return row.price * row.number
    }
  }
]

const handleOpen = () => {
  formData.value.details = props.currentObj.part_list || []
}
const formData = ref(JSON.parse(JSON.stringify(SPDEFAULT_FORM_DATA)))

const editTableRef = ref<any>()
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

const process_id = computed(() => {
  const { out_auth_info, parts_auth_info, status } = props.currentObj
  return status === 5 ? out_auth_info.id : parts_auth_info?.id
})
const formRef = ref<FormInstance | null>(null)
const handleAuditOk = () => {
  console.log(123123, formRef.value)
  if (props.isMaterials) {
    formRef.value?.validate(async (valid: boolean, fields) => {
      const isOk = await editTableRef.value?.validEvent()
      if (!valid || !isOk) return console.error("表单校验不通过", fields)
      let params = {
        status: 1,
        process_id: process_id.value,
        ...formData.value
      }
      auditProcessList(params).then(() => {
        ElMessage.success("审核成功")
        emit("update:show", false)
        emit("refresh")
      })
    })
  } else {
    auditProcessList({
      status: 1,
      process_id: process_id.value
    }).then(() => {
      ElMessage.success("审核成功")
      emit("update:show", false)
      emit("refresh")
    })
  }
}
const { uConfirm } = useBottom()
const handleAuditNo = () => {
  uConfirm("驳回", async () => {
    const params = {
      status: 2,
      process_id: process_id.value
    }
    auditProcessList(params).then(() => {
      ElMessage.success("审核成功")
      emit("update:show", false)
      emit("refresh")
    })
  })
}
//#endregion

//#region 验收
const DEFAULT_FORM_DATA: any = {
  id: undefined,
  check_reason: ""
}
const formCheckData = ref(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
const formCheckRules: FormRules = {
  check_reason: [{ required: true, trigger: "blue", message: "请输入理由" }]
}
const formCheckRef = ref<FormInstance | null>(null)
const handleCheckOk = () => {
  checkOrder({
    ...formCheckData.value,
    status: 2,
    id: props.currentObj.id
  }).then(() => {
    ElMessage.success("操作成功")
    emit("update:show", false)
    emit("refresh")
  })
}
const handleCheckNo = () => {
  formCheckRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    checkOrder({
      ...formCheckData.value,
      status: -1,
      id: props.currentObj.id
    }).then(() => {
      ElMessage.success("操作成功")
      emit("update:show", false)
      emit("refresh")
    })
  })
}
//#endregion

//#region 评价
const EVALUATE_FORM_DATA: any = {
  id: undefined,
  overall_star: undefined,
  quality_star: undefined,
  service_star: undefined,
  time_star: undefined,
  remark: ""
}
const formEvaluateData = ref(JSON.parse(JSON.stringify(EVALUATE_FORM_DATA)))
const formEvaluateRules: FormRules = {
  overall_star: [{ required: true, trigger: "change", message: "请选择总评分" }],
  quality_star: [{ required: true, trigger: "change", message: "请选择维修质量" }],
  service_star: [{ required: true, trigger: "change", message: "请选择服务态度" }],
  time_star: [{ required: true, trigger: "change", message: "请选择接/派单时效" }]
}
const formEvaluateRef = ref<FormInstance | null>(null)
const handleEvaluateOk = () => {
  formEvaluateRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    commentOrder({
      ...formEvaluateData.value,
      id: props.currentObj.id
    }).then(() => {
      ElMessage.success("操作成功")
      emit("update:show", false)
      emit("refresh")
    })
  })
}
//#endregion

//#region 投诉处理
const COMPLAIN_FORM_DATA: any = {
  id: undefined,
  handle_content: ""
}
const formComplainData = ref(JSON.parse(JSON.stringify(COMPLAIN_FORM_DATA)))
const formComplainRules: FormRules = {
  handle_content: [{ required: true, trigger: "blue", message: "请输入处理投诉结果反馈" }]
}
const formComplainRef = ref<FormInstance | null>(null)
const handleComplain = () => {
  formComplainRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    referOrder({
      ...formComplainData.value,
      id: props.currentObj.id
    }).then(() => {
      ElMessage.success("操作成功")
      emit("update:show", false)
      emit("refresh")
    })
  })
}
//#endregion

//#region 赔付
const COMPENSATE_FORM_DATA: any = {
  id: undefined,
  image: [],
  repair_list: [],
  amount: undefined,
  payer_name: "",
  payer_num: "",
  payer_phone: "",
  cc_name: "",
  cc_num: "",
  cc_phone: ""
}
const formCompensateData = ref(JSON.parse(JSON.stringify(COMPENSATE_FORM_DATA)))
const formCompensateRules: FormRules = {
  image: [{ required: true, trigger: "change", message: "请上传图片" }],
  repair_list: [{ required: true, trigger: "change", message: "请上传维修清单" }],
  amount: [{ required: true, trigger: "change", message: "请填写支付金额" }],
  payer_name: [{ required: true, trigger: "change", message: "请填写赔付人姓名" }],
  payer_num: [{ required: true, trigger: "change", message: "请填写学/工号" }],
  payer_phone: [{ required: true, trigger: "change", message: "请填写电话" }]
}
const formCompensateRef = ref<FormInstance | null>(null)
const handleCompensateOk = () => {
  formCompensateRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    auditProcessList({
      ...formCompensateData.value,
      status: 1,
      process_id: props.currentObj?.pay_auth_info?.id
    }).then(() => {
      ElMessage.success("操作成功")
      emit("update:show", false)
      emit("refresh")
    })
  })
}
const handleCompensateNo = () => {
  uConfirm("驳回", async () => {
    auditProcessList({
      ...formCompensateData.value,
      status: 2,
      process_id: props.currentObj?.pay_auth_info?.id
    }).then(() => {
      ElMessage.success("操作成功")
      emit("update:show", false)
      emit("refresh")
    })
  })
}
//#endregion

const emit = defineEmits(["update:show", "refresh"])
const resetForm = () => {
  // 验收
  formCheckRef.value?.resetFields()
  formCheckData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA))
  // 评价
  formEvaluateRef.value?.resetFields()
  formEvaluateData.value = JSON.parse(JSON.stringify(EVALUATE_FORM_DATA))
  // 赔付审核
  formCompensateRef.value?.resetFields()
  formCompensateData.value = JSON.parse(JSON.stringify(EVALUATE_FORM_DATA))
  // 材料审核
  formRef.value?.resetFields()
  formData.value = JSON.parse(JSON.stringify(SPDEFAULT_FORM_DATA))
}
</script>
<style lang="scss" scoped>
.formTitle {
  color: #303133;
  font-size: 16px;
  font-weight: bold;
  height: 40px;
  display: flex;
  flex-direction: column-reverse;
}

::v-deep(.el-collapse-item__content) {
  padding-bottom: 10px;
}

::v-deep(.el-divider--horizontal) {
  margin: 15px 0;
}
</style>
