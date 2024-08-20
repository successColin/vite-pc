import { request } from "@/utils/service"

// 维修类目设置
export function getOrderList(params: any) {
  return request<ApiResponseData<any>>({
    url: "repair_manage/order_list",
    method: "get",
    params
  })
}

export function editSetOrder(data: any) {
  return request<ApiResponseData<any>>({
    url: "repair_manage/set_order",
    method: "post",
    data
  })
}

export function detailSetOrder(params: any) {
  return request<ApiResponseData<any>>({
    url: "repair_manage/order_detail",
    method: "get",
    params
  })
}

export function deleSetOrder(data: any) {
  return request<ApiResponseData<any>>({
    url: "repair_manage/order_del",
    method: "post",
    data
  })
}

export function getRepairUserList() {
  return request<ApiResponseData<any>>({
    url: "repair_manage/repair_user_list",
    method: "get"
  })
}

export function setDispatchOrder(data: any) {
  return request<ApiResponseData<any>>({
    url: "repair_manage/dispatch_order",
    method: "post",
    data
  })
}

//  验收
export function checkOrder(data: any) {
  return request<ApiResponseData<any>>({
    url: "repair_manage/order_check",
    method: "post",
    data
  })
}

// 评价
export function commentOrder(data: any) {
  return request<ApiResponseData<any>>({
    url: "repair_manage/order_comment",
    method: "post",
    data
  })
}

// 投诉处理
export function referOrder(data: any) {
  return request<ApiResponseData<any>>({
    url: "repair_manage/order_refer",
    method: "post",
    data
  })
}

// 三个审核：校外、材料、赔付
export function auditProcessList(data: any) {
  return request<ApiResponseData<any>>({
    url: "process/deal_process",
    method: "post",
    data
  })
}

// 赔付单列表
export function getPayList() {
  return request<ApiResponseData<any>>({
    url: "process/pay_list",
    method: "get"
  })
}
