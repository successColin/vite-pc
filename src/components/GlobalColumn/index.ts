export function getDefineProps() {
  const props = withDefaults(
    defineProps<{
      buttonArr: Array<any>
      tableHeight: number
      loading: boolean
      handleSelectionChange: Function
    }>(),
    {
      buttonArr: () => [],
      tableHeight: 0,
      loading: false,
      handleSelectionChange: () => {}
    }
  )
  return { props }
}
