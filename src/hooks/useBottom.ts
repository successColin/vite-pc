import { type ElMessageBoxOptions, ElMessageBox } from "element-plus"

function uConfirm(string: String, callback?: () => void) {
  const tip = `确定<strong style="color: var(--el-color-danger);">${string}</strong>吗？`
  const config: ElMessageBoxOptions = {
    type: "warning",
    showClose: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true
  }
  ElMessageBox.confirm(tip, "提示", config).then(() => {
    callback && callback()
  })
}

/** 主题 hook */
export function useBottom() {
  return { uConfirm }
}
