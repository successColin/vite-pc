import App from "@/App.vue"
import { loadDirectives } from "@/directives"
import { loadPlugins } from "@/plugins"
import router from "@/router"
import "@/router/permission"
import store from "@/store"
import "@/styles/index.scss"
import "normalize.css"
import "uno.css"
import "virtual:svg-icons-register"
import { createApp } from "vue"
import "vxe-table-plugin-element/dist/style.css"
import "vxe-table/lib/style.css"

import { registerGlobalComponents } from "@/utils/index"

const app = createApp(App)

/** 加载插件 */
loadPlugins(app)
/** 加载自定义指令 */
loadDirectives(app)
registerGlobalComponents(app)
app.use(store).use(router)
router.isReady().then(() => {
  app.mount("#app")
})
