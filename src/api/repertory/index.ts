import { request } from "@/utils/service"

// 入库列表
export function getStockList(params: any) {
  return request<ApiResponseData<any>>({
    url: "stock/list",
    method: "get",
    params
  })
}

// 入库
export function addStock(data: any) {
  return request<ApiResponseData<any>>({
    url: "stock/entry",
    method: "post",
    data
  })
}

// 出库列表
export function getOutList(params: any) {
  return request<ApiResponseData<any>>({
    url: "stock/out_list",
    method: "get",
    params
  })
}

// 出库
export function addOut(data: any) {
  return request<ApiResponseData<any>>({
    url: "stock/out",
    method: "post",
    data
  })
}

// ------------------------------
// 库存列表
export function getAllStockList(params: any) {
  return request<ApiResponseData<any>>({
    url: "stock/stock_list",
    method: "get",
    params
  })
}

// 下载
export function exportStockList(params: any) {
  return request<ApiResponseData<any>>({
    url: "stock/stock_list",
    method: "get",
    responseType: "blob",
    params
  })
}

// 设置存量预警
export function setStockMin(data: any) {
  return request<ApiResponseData<any>>({
    url: "stock/set_stock_min",
    method: "post",
    data
  })
}
