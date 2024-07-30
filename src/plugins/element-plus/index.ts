import ElementPlus from "element-plus"
import { type App } from "vue"

export function loadElementPlus(app: App) {
  /** Element Plus 组件完整引入 */
  app.use(ElementPlus)
}
