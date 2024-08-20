<template>
  <el-upload
    :limit="limit"
    action="#"
    list-type="picture-card"
    :http-request="doUpload"
    :file-list="fileList"
    :class="(limit && fileLen === limit) || disabled ? 'hide_box' : ''"
  >
    <el-icon><Plus /></el-icon>
    <template #file="{ file }">
      <div style="position: relative; width: 100%">
        <img v-if="+file.type === 1" class="el-upload-list__item-thumbnail" :src="file.url" alt="文件" />
        <div v-else-if="+file.type === 2">
          <video class="el-upload-list__item-thumbnail" :src="file.url" />
          <img
            :src="playImg"
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px"
          />
        </div>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <el-icon><zoom-in /></el-icon>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img
      v-if="+showType === 1"
      w-full
      :src="dialogImageUrl"
      alt="Preview Image"
      style="height: 70vh; width: auto; margin: 0 auto; display: block"
    />
    <video v-else-if="+showType === 2" controls w-full style="height: 70vh">
      <source :src="dialogImageUrl" type="video/mp4" />
    </video>
  </el-dialog>
</template>

<script lang="ts" setup>
import { updateFile } from "@/api/home"
import playImg from "@/assets/image/play.png"
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue"

const props = withDefaults(
  defineProps<{
    fileList?: Array<any>
    disabled?: boolean
    limit?: number
    isCloud?: boolean
  }>(),
  {
    fileList: () => [],
    disabled: false,
    isCloud: false
  }
)

const emit = defineEmits(["update:fileList"])
const doUpload = async (param: any) => {
  const { file } = param
  const formData = new FormData()
  formData.append("file", file)
  if (props.isCloud) {
    formData.append("is_cloud", "1")
  }
  console.log(formData, file)
  // type=1 图片 type=2视频
  let type = ""
  if (file.type.indexOf("image") !== -1) {
    type = "1"
  } else if (file.type.indexOf("video") !== -1) {
    type = "2"
  }
  const {
    data: { url, cloud_url }
  } = await updateFile(formData)
  console.log(url)
  const arr = [...props.fileList, { url, type, cloud_url }]
  emit("update:fileList", arr)
}

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
// 删除
const handleRemove = (file: UploadFile) => {
  const i = props.fileList.findIndex((item) => item.url === file.url)
  props.fileList.splice(i, 1)
  emit("update:fileList", props.fileList)
}

// 预览
const dialogImageUrl = ref("")
const dialogVisible = ref(false)
const showType = ref("")
const handlePictureCardPreview = (file: UploadFile) => {
  showType.value = file.type!
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const fileLen = computed(() => props.fileList.length)
</script>
<style lang="scss" scoped>
.hide_box {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}
</style>
