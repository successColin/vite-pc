<template>
  <div class="homeClass">
    <el-image style="width: 100%; height: 100%" :src="homeUrl" lazy fit="cover" />
  </div>
</template>

<script setup lang="ts">
import homeUrl from "@/assets/image/home.jpg"
</script>

<style scoped lang="scss">
.homeClass {
  margin: 10px;
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
}
</style>
