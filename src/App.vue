<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import zhCn from "element-plus/es/locale/lang/zh-cn"
const { initTheme } = useTheme()
initTheme()
useRouter().replace({
  query: {}
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
