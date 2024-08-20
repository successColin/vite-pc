export function watchEle(ele: Ref<HTMLDivElement | null>) {
  const height = ref(0)
  // 计算表格高度
  const calculateTableHeight = () => {
    if (ele.value) {
      height.value = ele.value.clientHeight
    }
  }
  onMounted(() => {
    setTimeout(() => {
      calculateTableHeight()
    }, 100)

    window.addEventListener("resize", calculateTableHeight)
  })
  onBeforeUnmount(() => {
    window.removeEventListener("resize", calculateTableHeight)
  })
  return { height }
}
