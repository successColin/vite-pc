<template>
  <el-table-column fixed="right" v-bind="$attrs" :label="label">
    <template #default="scope">
      <div v-for="(v, i) in buttonArr" :key="i" class="buttonClass">
        <el-button
          class="buttonClass__ele"
          v-if="isShow(v, scope.row)"
          :type="v.type"
          size="small"
          @click="$emit(v.funcName, scope.row, v)"
        >
          {{ v.label }}
        </el-button>
      </div>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    buttonArr?: Array<any>
    label?: string
  }>(),
  {
    buttonArr: () => [],
    label: "操作"
  }
)

const isShow = computed(() => {
  return (v: any, row: any) => {
    if (!v.isShow) return true
    const len = v.isShow.length
    let type = false
    for (let i = 0; i < len; i++) {
      const item = v.isShow[i]
      if (item.type1 === "==" && row[item.prop] === item.value && row[item.prop1] === item.value1) {
        type = true
        break
      } else if (item.type1 === "!=" && row[item.prop] === item.value && row[item.prop1] !== item.value1) {
        type = true
        break
      } else if (Array.isArray(item.value) && item.value.includes(row[item.prop])) {
        type = true
        break
      } else if (!item.type1 && row[item.prop] === item.value) {
        type = true
        break
      } else if (!item.type1 && "noEqualvalue" in item && row[item.prop] !== item.noEqualvalue) {
        type = true
        break
      }
    }
    return type
  }
})
</script>

<style lang="scss" scoped>
.buttonClass {
  display: inline-block;
  &__ele {
    margin: 0 5px;
  }
  &__ele:first-child {
    margin-left: 0;
  }
}
</style>
