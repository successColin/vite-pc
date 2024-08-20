import { request } from "@/utils/service"

export function getUserInfo() {
  return request<ApiResponseData<any>>({
    url: "me",
    method: "get"
  })
}

export function updateFile(data: any) {
  return request<ApiResponseData<any>>({
    url: "upload_file",
    method: "post",
    data,
    headers: {
      "content-type": "multipart/form-data"
    }
  })
}

// 发布范围
// 学生年级列表
export function getStudents(params: any) {
  return request<ApiResponseData<any>>({
    url: "notice/grade_list",
    method: "get",
    params
  })
}

// 教师系部
export function getTeachers(params: any) {
  return request<ApiResponseData<any>>({
    url: "notice/dept_list",
    method: "get",
    params
  })
}
