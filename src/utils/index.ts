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

export function registerGlobalComponents(app: App) {
  const components = import.meta.glob("../components/*/index.vue")
  for (const [path, resolve] of Object.entries(components)) {
    const componentName = path.replace("./", "").split("/")[1]
    const asyncComponent = defineAsyncComponent(() => resolve().then((mod) => (mod as any).default))
    app.component(componentName, asyncComponent)
  }
}
