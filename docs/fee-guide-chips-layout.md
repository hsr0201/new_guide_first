# 费用卡片向导 Chip 区：布局与滑动需求备忘

## 背景

`FeeDetailsCard.vue` 中向导列表区域（`fee-guide-wrap` / `fee-guide-row--scroll` / `fee-guide-row-2lines`）当前为：

- 双行展示，横向 `overflow-x: auto`。
- 两行分配方式：按数组下标奇偶交错（`i % 2 === 0` 上行，奇数下行），**不是**按「前一半 / 后一半」，也**未**按名称宽度均衡。

## 产品期望（待实现 / 评审）

1. **按数量**：例如向导很少（如 ≤3）时，可改为**单行**展示，不必固定两行。
2. **按是否溢出**：若两行（或单行）在容器内**总宽度能放下**，则**不需要滑动**（可配合测量 `scrollWidth` 与 `clientWidth` 动态去掉滚动样式或隐藏滚动条）。
3. **按名称长短**：向导名长度不一，希望两行时**上下行总宽度尽量均衡**（或指定个数时如 7 个、9 个的分布策略）；纯 CSS 难以保证最优，需 **JS 测量 chip 宽度** 或 **估算文字宽度** 后再分包。

## 代码位置

- 组件：`src/components/figma/FeeDetailsCard.vue`
- 分行计算：`chipItemsLine1` / `chipItemsLine2`、`confirmedChipsLine1` / `confirmedChipsLine2`（computed）
- 样式：`.fee-guide-row--scroll`、`.fee-guide-row-2lines`、`.fee-guide-line`

## 备注

- DOM 中 class 以仓库为准：`fee-guide-row-2lines`。
- 与对话中讨论的「全宽 / Figma」全局规则无关，仅记录本模块交互与布局诉求。
