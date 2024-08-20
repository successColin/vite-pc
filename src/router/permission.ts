import systemConfig from "@/config"
import routeSettings from "@/config/route"
import isWhiteList from "@/config/white-list"
import { setRouteChange } from "@/hooks/useRouteListener"
import { useTitle } from "@/hooks/useTitle"
import router from "@/router"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { useUserStoreHook } from "@/store/modules/user"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import { ElMessage } from "element-plus"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  type Token = {
    sso_token: string
  }
  const { sso_token } = to.query as Token
  if (to.path === "/home" && sso_token) {
    removeToken()
    setToken(sso_token)
  }
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = getToken()

  // 如果没有登陆
  if (!token) {
    // 如果在免登录的白名单中，则直接进入
    if (isWhiteList(to)) return next()
    // window.location.href = systemConfig.portalSystemUrl.toString()
    return next(false)
  }
  try {
    await userStore.getInfo()
    routeSettings.dynamic ? permissionStore.setRoutes([]) : permissionStore.setAllRoutes()
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    next()
  } catch (err: any) {
    ElMessage.error(err.message || "路由守卫过程发生错误")
    // window.location.href = systemConfig.portalSystemUrl.toString()
    return next(false)
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
  NProgress.done()
})
