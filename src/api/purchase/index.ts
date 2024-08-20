import { request } from "@/utils/service"

// 采购单列表
export function getProcureList(params: any) {
  return request<ApiResponseData<any>>({
    url: "process/procure_list",
    method: "get",
    params
  })
}

// 发起采购
export function editLaunchProcure(data: any) {
  return request<ApiResponseData<any>>({
    url: "process/launch_procure",
    method: "post",
    data
  })
}

// 采购撤回
export function revocationProcure(data: any) {
  return request<ApiResponseData<any>>({
    url: "process/procure_del",
    method: "post",
    data
  })
}

// 同步工程流程
export function procureFlowSync(data: any) {
  return request<ApiResponseData<any>>({
    url: "process/flow_sync",
    method: "post",
    data
  })
}

// 打款凭证
export function putVoucher(data: any) {
  return request<ApiResponseData<any>>({
    url: "process/put_voucher",
    method: "post",
    data
  })
}
