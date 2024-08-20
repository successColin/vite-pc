import { defineConfig, presetAttributify, presetUno } from "unocss"

export default defineConfig({
  /** 预设 */
  presets: [
    /** 属性化模式 & 无值的属性模式 */
    presetAttributify(),
    /** 默认预设 */
    presetUno()
  ],
  /** 自定义规则 */
  rules: [
    // [/^m-(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })],
    // [/^m-t(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })],
    // [/^m-r(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })],
    // [/^m-b(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })],
    // [/^m-l(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })],
    // [/^p-(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })],
    // [/^p-t(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })],
    // [/^p-r(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })],
    // [/^p-b(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })],
    // [/^p-l(\d+)$/, ([, d]) => ({ margin: `${Number(d)}px` })]
  ],
  /** 自定义快捷方式 */
  shortcuts: {
    "uno-wh-full": "w-full h-full",
    "uno-flex-center": "flex justify-center items-center",
    "uno-flex-x-center": "flex justify-center",
    "uno-flex-y-center": "flex items-center"
  }
})
