interface paginationData {
  currentPage: number
  pageSize: number
  total: number
}
import { useBottom } from "@/hooks/useBottom"
import { watchEle } from "@/hooks/userContentHeight"
import { ElMessage } from "element-plus"
/** 主题 hook */
export function useTable(
  contentBoxRef: any,
  searchBoxRef: any,
  getApi: Function,
  delApi: Function,
  paginationData: paginationData,
  searchData: any
) {
  const loading = ref<boolean>(false)
  const tableData = ref([])
  const multipleSelection = ref<number[]>([])
  const allDate = ref<any>([])
  let height = ref<number>(0)
  if (contentBoxRef && searchBoxRef) {
    const { height: boxH } = watchEle(contentBoxRef)
    let { height: searchH } = watchEle(searchBoxRef)

    watch(
      [boxH, searchH],
      (v) => {
        height.value = v[0] - v[1] - 40 - 60 - 80
      },
      { deep: true, immediate: true }
    )
  }

  const getTableData = async () => {
    loading.value = true
    try {
      let newSearchData = JSON.parse(JSON.stringify(searchData))
      const res = await getApi({
        page: paginationData.currentPage,
        page_size: paginationData.pageSize,
        ...newSearchData
      })
      allDate.value = res
      const { data, total } = res
      paginationData.total = total
      tableData.value = data
      loading.value = false
    } catch (error) {
      tableData.value = []
      loading.value = false
    }
  }
  const handleSearch = () => {
    paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
  }
  const { uConfirm } = useBottom()
  const handleDelete = (row: any) => {
    delFun(row.id, "删除该条数据")
  }
  const handleBatchDel = () => {
    const ids = multipleSelection.value.join(",")
    if (!ids) {
      return ElMessage({
        message: "请选择数据",
        type: "warning"
      })
    }
    delFun(ids, "批量删除数据")
  }
  const delFun = (id: string | number, dec: string) => {
    uConfirm(dec, async () => {
      await delApi({
        id,
        status: 2
      })
      ElMessage({
        message: "删除成功",
        type: "success"
      })
      handleSearch()
    })
  }
  const multipleSelectionAllArr = ref<any>([])
  const handleSelectionChange = (val: Array<any>) => {
    nextTick(() => {
      if (!val.length) return
      multipleSelection.value = []
      multipleSelectionAllArr.value = val
      val.forEach((v) => {
        return multipleSelection.value.push(v.id)
      })
    })
  }
  const indexMethod = (index: number) => {
    return index + 1
  }
  return {
    allDate,
    height,
    indexMethod,
    multipleSelection,
    multipleSelectionAllArr,
    loading,
    tableData,
    getTableData,
    handleSearch,
    handleDelete,
    handleBatchDel,
    handleSelectionChange
  }
}
