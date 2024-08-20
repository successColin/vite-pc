<template>
  <el-descriptions :column="column" :title="title">
    <el-descriptions-item class="descriptions" v-for="(v, i) in arr" :key="i" :label="`${v.label}:`">
      <span
        class="descriptions__imgAndVideo"
        v-if="v.type === 1 && v.value?.length"
        v-for="(item, i) in v.value"
        :key="i"
        :src="item.url"
        @click="handlePictureCardPreview(item)"
      >
        <img class="el-upload-list__item-thumbnail" v-if="+item.type === 1" :src="item.url" />
        <div v-else-if="+item.type === 2" style="position: relative">
          <video class="el-upload-list__item-thumbnail" :src="item.url" />
          <img
            src="@/assets/image/play.png"
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px"
          />
        </div>
      </span>
      <span v-else-if="v.type === 1 && v.value?.length === 0">无</span>
      <span v-else-if="v.type === 2">
        <global-rate v-model:value="v.value" :disabled="true"></global-rate>
      </span>
      <span v-else-if="v.type === 3">
        <div v-html="v.value || '无'"></div>
      </span>
      <span v-else>{{ v.value || "无" }}</span>
    </el-descriptions-item>
  </el-descriptions>

  <el-dialog v-model="dialogVisible">
    <img
      v-if="+showType === 1"
      w-full
      :src="dialogImageUrl"
      alt="Preview Image"
      style="max-height: 70vh; width: auto; margin: 0 auto; display: block; max-width: 100%"
    />
    <video v-else-if="+showType === 2" controls w-full style="height: 70vh">
      <source :src="dialogImageUrl" type="video/mp4" />
    </video>
  </el-dialog>
</template>

<script setup lang="ts">
// import playImg from "@/assets/image/play.png"
import { ref } from "vue"
withDefaults(
  defineProps<{
    // 1：图片/视频 2: 评分 3: 富文本
    arr: Array<{ label: string; value: any; type: number }>
    column?: number
    title?: string
  }>(),
  {
    arr: () => [],
    column: 3,
    title: ""
  }
)

type UploadStatus = "ready" | "uploading" | "success" | "fail"
interface UploadRawFile extends File {
  uid: number
}
interface UploadFile {
  name: string
  percentage?: number
  status: UploadStatus
  size?: number
  response?: unknown
  uid: number
  url?: string
  raw?: UploadRawFile
  type: string
}

const dialogImageUrl = ref("")
const dialogVisible = ref(false)
const showType = ref("")
const handlePictureCardPreview = (file: UploadFile) => {
  showType.value = file.type!
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.descriptions {
  &__imgAndVideo {
    width: 140px;
    height: 140px;
    display: inline-block;
    position: relative;
    top: 5px;
    img {
      width: auto;
      height: 100%;
      margin: 0 auto;
      display: block;
    }
    div {
      height: 100%;
      width: 100%;
      image,
      video {
        width: auto;
        height: 100%;
        margin: 0 auto;
        display: block;
      }
    }
  }
}
</style>
