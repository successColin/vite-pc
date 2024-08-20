import { request } from "@/utils/service"

// 校外审核列表
export function getOutList(params: any) {
  return request<ApiResponseData<any>>({
    url: "process/out_list",
    method: "get",
    params
  })
}

// 维修款申请列表
export function getRepairPayList(params: any) {
  return request<ApiResponseData<any>>({
    url: "process/repair_pay_list",
    method: "get",
    params
  })
}

// 维修款申请列表撤回
export function removeRepairPay(data: any) {
  return request<ApiResponseData<any>>({
    url: "process/repair_pay_del",
    method: "post",
    data
  })
}

// 维修款申请添加
export function addRepairPay(data: any) {
  return request<ApiResponseData<any>>({
    url: "process/repair_pay_apply",
    method: "post",
    data
  })
}

// 维修款打款申请列表
export function getRepairPayPaymentList(params: any) {
  return request<ApiResponseData<any>>({
    url: "process/repair_pay_payment_list",
    method: "get",
    params
  })
}

// 校外维修详情
export function getOutDetail(params: any) {
  return request<ApiResponseData<any>>({
    url: "process/out_detail",
    method: "get",
    params
  })
}

// 获取维修单位银行信息
export function getProjectBank(params: any) {
  return request<ApiResponseData<any>>({
    url: "process/get_project_bank",
    method: "get",
    params
  })
}

// 维修款打款
export function repairPayPayment(data: any) {
  return request<ApiResponseData<any>>({
    url: "process/repair_pay_payment",
    method: "post",
    data
  })
}
