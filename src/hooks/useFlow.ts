import { procureFlowSync } from "@/api/purchase"

export function useFlow() {
  const flowArr = ref<any[]>([])
  const flowActive = ref<number>(0)
  const approvalStatusText = ref<string>("")
  const getSetps = async (params: any) => {
    const { data } = await procureFlowSync(params)
    const { step, flow_case_process, approval_status_text } = data
    flowArr.value = flow_case_process
    flowActive.value = step
    approvalStatusText.value = approval_status_text
  }
  return { getSetps, flowArr, flowActive, approvalStatusText }
}
