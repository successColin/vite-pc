import { getUserInfo } from "@/api/home"
import { resetRouter } from "@/router"
import store from "@/store"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useSettingsStore } from "./settings"
import { useTagsViewStore } from "./tags-view"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const username = ref<string>("")
  const userInfoObj = reactive({})

  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 获取用户详情 */
  const getInfo = async () => {
    const { data } = await getUserInfo()
    username.value = data.username
    Object.assign(userInfoObj, data)
  }
  /** 模拟角色变化 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    // 用刷新页面代替重新登录
    window.location.reload()
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, username, userInfoObj, getInfo, changeRoles, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
