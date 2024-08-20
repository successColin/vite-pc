const IsNo = [
  {
    value: 0,
    label: "否"
  },
  {
    value: 1,
    label: "是"
  }
]

// 工单情况
const orderStatus = [
  {
    value: 0,
    label: "正常"
  },
  {
    value: 1,
    label: "超时"
  }
]

// 阅读状态
const readStatus = [
  {
    value: 1,
    label: "已阅读"
  },
  {
    value: 0,
    label: "未阅读"
  }
]

// 紧急程度
const IsUrgentType = [
  {
    value: 0,
    label: "普通"
  },
  {
    value: 1,
    label: "紧急"
  }
]
// 损害性质
const IsManMade = [
  {
    value: 0,
    label: "自然损坏"
  },
  {
    value: 1,
    label: "人为损坏"
  }
]

// 维修状态
const libraryType = [
  {
    value: -1,
    label: "取消"
  },
  {
    value: 0,
    label: "待接单"
  },
  {
    value: 1,
    label: "维修中"
  },
  {
    value: 3,
    label: "完成"
  },
  {
    value: 4,
    label: "无需维修"
  },
  {
    value: 5,
    label: "校外维修"
  },
  {
    value: 6,
    label: "配件维修"
  },
  {
    value: 7,
    label: "待验收"
  },
  {
    value: 8,
    label: "验收不通过 "
  },
  {
    value: 9,
    label: "待评价"
  },
  {
    value: 10,
    label: "投诉"
  },
  {
    value: 11,
    label: "超时"
  }
]

// 公告显示状态
const noticeState = [
  {
    value: 1,
    label: "显示"
  },
  {
    value: 0,
    label: "隐藏"
  }
]

const moneyType = [
  {
    value: 1,
    label: "进度款"
  },
  {
    value: 2,
    label: "决算款"
  }
]

const purchaseStates = [
  {
    value: 0,
    label: "审批中"
  },
  {
    value: 1,
    label: "通过"
  },
  {
    value: 2,
    label: "拒绝"
  }
]

const entryType = [
  {
    value: 1,
    label: "采购入库"
  },
  {
    value: 2,
    label: "退库入库"
  }
]

const stockTemovalType = [
  {
    value: 1,
    label: "手动出库"
  },
  {
    value: 2,
    label: "工单审核出库"
  }
]

export {
  IsManMade,
  IsNo,
  IsUrgentType,
  entryType,
  libraryType,
  moneyType,
  noticeState,
  orderStatus,
  purchaseStates,
  readStatus,
  stockTemovalType
}
