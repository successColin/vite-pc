import { removeConfigLayout } from "@/utils/cache/local-storage"
import dayjs from "dayjs"
import { App, defineAsyncComponent } from "vue"

/** 格式化时间 */
export const formatDateTime = (time: string | number | Date) => {
  return time ? dayjs(new Date(time)).format("YYYY-MM-DD HH:mm:ss") : "N/A"
}

/** 用 JS 获取全局 css 变量 */
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = ""
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/** 用 JS 设置全局 CSS 变量 */
export const setCssVariableValue = (cssVariableName: string, cssVariableValue: string) => {
  try {
    document.documentElement.style.setProperty(cssVariableName, cssVariableValue)
  } catch (error) {
    console.error(error)
  }
}

/** 重置项目配置 */
export const resetConfigLayout = () => {
  removeConfigLayout()
  location.reload()
}

export function exportFun(data: any, name: string) {
  const blob = new Blob([data], { type: "application/vnd.ms-excel" })
  const href = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.style.display = "none"
  a.href = href
  a.download = `${name}.xlsx`
  a.click()
  URL.revokeObjectURL(a.href)
}

export function registerGlobalComponents(app: App) {
  const components = import.meta.glob("../components/**/index.vue")
  for (const [path, resolve] of Object.entries(components)) {
    const arr = path.split("/")
    const componentName = arr[arr.length - 2]
    const asyncComponent = defineAsyncComponent(() => resolve().then((mod) => (mod as any).default))
    app.component(componentName, asyncComponent)
  }
}

interface TreeNode {
  value: number
  label: string
  children?: TreeNode[]
}
export function transformToTree(data: [any]): TreeNode[] {
  const map = new Map<number, TreeNode>()

  // Initialize nodes
  data.forEach((item) => {
    map.set(item.id, {
      value: item.id,
      label: item.category_name,
      children: []
    })
  })
  console.log(data)

  const result: TreeNode[] = []

  // Build tree structure
  data.forEach((item) => {
    const node = map.get(item.id)!
    if (item.pid === 0) {
      result.push(node)
    } else {
      const parentNode = map.get(item.pid)
      if (parentNode) {
        parentNode.children!.push(node)
      }
    }
  })

  return result
}
