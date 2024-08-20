<template>
  <el-table-column :label="label">
    <template #default="scope">
      <div :scope="scope" :style="highlightStyle(scope.row[prop], scope.row)">
        <div v-if="JSON.stringify(switchVal) !== '[]'">
          {{ currentSwitchVal(scope.row) }}
        </div>
        <div v-else-if="otherProp">
          {{ getNestedPropValue(scope.row) }}
        </div>
        <div v-else>
          {{ value || scope.row[prop] }}
        </div>
      </div>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    prop: string
    label: string
    highlightVal?: Array<string>
    otherHighlightVal?: any
    switchVal?: Array<{ value: number; label: string }>
    otherProp?: string
    value?: any
  }>(),
  {
    prop: "",
    label: "",
    highlightVal: () => [],
    switchVal: () => [],
    otherHighlightVal: () => {},
    otherProp: ""
  }
)

const getNestedPropValue = (obj: Record<string, any>) => {
  return props.otherProp.split(".").reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : ""
  }, obj[props.prop])
}

const currentSwitchVal = (obj: Record<string, any>) => {
  const match = props.switchVal.find((item) => item.value === obj[props.prop])
  return match ? match.label : ""
}

const highlightStyle = (val: any, obj: Record<string, any>) => {
  const isHighlighted =
    props.highlightVal.includes(val) ||
    (props.otherHighlightVal && props.otherHighlightVal.val === obj[props.otherHighlightVal?.prop])
  return {
    color: isHighlighted ? "rgb(255, 90, 90)" : ""
  }
}
</script>
