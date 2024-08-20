<!-- src/components/Editor.vue -->
<template>
  <div class="editor">
    <Toolbar class="editor__toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      :style="`height: ${height}; overflow-y: hidden`"
      :model-value="value"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import "@wangeditor/editor/dist/css/style.css"

const { value } = defineProps({
  value: {
    type: String,
    default: ""
  },
  height: {
    type: String,
    default: "500px"
  }
})

const mode = "default" // 或 'simple'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  placeholder: "请输入内容...",
  excludeMenus: ["uploadImage", "uploadVideo"]
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor
}
const emit = defineEmits(["update:value"])
const handleChange = (editor) => {
  let currentContent = editor.getHtml()
  if (currentContent === "<p><br></p>") {
    currentContent = ""
  }
  emit("update:value", currentContent)
}
</script>
<style lang="scss" scoped>
.editor {
  border: 1px solid #ccc;
  &__toolbar {
    border-bottom: 1px solid #ccc;
  }
}
</style>
