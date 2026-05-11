# new-guide-first

基于 **Vue 3** + **Vite** + **Vue Router** 的 B 端工作台前端原型，还原 Figma 中的「常用向导库」与「支付预估价」相关页面。静态数据与图片资源用于演示，后续可替换为真实接口。

## 技术栈

- Vue 3（`<script setup>`）
- Vue Router 4
- Vite 8

## 环境要求

- **Node.js**：`^20.19.0` 或 `>=22.12.0`（见 `package.json` 中 `engines`）

## 快速开始

```sh
npm install
npm run dev
```

本地开发默认由 Vite 输出访问地址（一般为 `http://localhost:5173`）。

```sh
npm run build    # 生产构建
npm run preview  # 本地预览构建产物
```

## 页面与路由

| 路径 | 说明 |
|------|------|
| `/` | 常用向导库：侧栏、推荐向导、常用向导卡片列表 |
| `/payment-estimate` | 支付预估价：步骤条、行程与费用摘要、右侧费用明细与发单相关操作 |

路由定义见 `src/router/index.js`。

## 目录结构（摘要）

```
src/
  assets/main.css      # 全局样式（全宽布局等）
  components/figma/    # 与设计稿对应的页面组件
  composables/         # 组合式函数（如 Toast）
  pages/               # 路由页面
  router/              # 路由配置
public/
  figma-assets/        # 从设计稿导出的本地静态资源（图标、插图等）
```

## 静态资源说明

设计相关图片、图标放在 `public/figma-assets/`，代码中以站点根路径引用（如 `/figma-assets/xxx.png`）。请勿在可合并代码中长期使用 Figma MCP 临时资源 URL；落盘时注意扩展名与实际文件格式一致。

## 开发约定（仓库内）

- `.cursor/rules/full-page-layout.mdc`：全宽工作台布局注意事项（`#app` / `body` 等）
- `.cursor/rules/figma-local-assets.mdc`：Figma 资源本地化与格式校验要求

## 许可证

私有项目（`package.json` 中 `"private": true`）。如需开源请自行补充许可证文件。
