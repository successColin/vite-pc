import { request } from "@/utils/service"

// 维修类目设置
export function getMaintenanceList() {
  return request<ApiResponseData<any>>({
    url: "system_manage/maintenance_list",
    method: "get"
  })
}

export function editMaintenance(data: any) {
  return request<ApiResponseData<any>>({
    url: "system_manage/maintenance_edit",
    method: "post",
    data
  })
}

export function delMaintenance(data: any) {
  return request<ApiResponseData<any>>({
    url: "system_manage/maintenance_delete",
    method: "post",
    data
  })
}

// 投诉类型设置
export function getReferTypeList(params: any) {
  return request<ApiResponseData<any>>({
    url: "system_manage/refer_type_list",
    method: "get",
    params
  })
}

export function editReferType(data: any) {
  return request<ApiResponseData<any>>({
    url: "system_manage/refer_type_edit",
    method: "post",
    data
  })
}

export function delReferType(data: any) {
  return request<ApiResponseData<any>>({
    url: "system_manage/refer_type_change",
    method: "post",
    data
  })
}

export function getReferConfig() {
  return request<ApiResponseData<any>>({
    url: "system_manage/refer_config",
    method: "get"
  })
}

export function editReferConfig(data: any) {
  return request<ApiResponseData<any>>({
    url: "system_manage/refer_set_config",
    method: "post",
    data
  })
}

// 出入库类型维护
export function getWarehouseList(params: any) {
  return request<ApiResponseData<any>>({
    url: "system_manage/warehouse_list",
    method: "get",
    params
  })
}

export function editWarehouseList(data: any) {
  return request<ApiResponseData<any>>({
    url: "system_manage/warehouse_edit",
    method: "post",
    data
  })
}

export function delWarehouseList(data: any) {
  return request<ApiResponseData<any>>({
    url: "system_manage/warehouse_delete",
    method: "post",
    data
  })
}

// 报修区域
export function getRepairAreaList() {
  return request<ApiResponseData<any>>({
    url: "repair_manage/repair_area_list",
    method: "get"
  })
}
