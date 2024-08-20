import { request } from "@/utils/service"

// 公告列表
export function getNoticeList(params: any) {
  return request<ApiResponseData<any>>({
    url: "notice/list",
    method: "get",
    params
  })
}

// 公告修改状态
export function editChangeStatus(data: any) {
  return request<ApiResponseData<any>>({
    url: "notice/change_status",
    method: "post",
    data
  })
}

// 公告修改
export function editNotice(data: any) {
  return request<ApiResponseData<any>>({
    url: "notice/save",
    method: "post",
    data
  })
}

// 公告详情
export function detailNoticeList(params: any) {
  return request<ApiResponseData<any>>({
    url: "notice/detail",
    method: "get",
    params
  })
}

// 阅读情况
export function getNoticeRead(params: any) {
  return request<ApiResponseData<any>>({
    url: "notice/read_list",
    method: "get",
    params
  })
}
