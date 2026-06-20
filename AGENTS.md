# AGENTS.md

本文件为本仓库的开发指引。代码注释与文档以中文为主，请保持一致。

## 仓库结构

这是一个双包仓库（非 monorepo 工具链，两个包各自独立）：

- `vue-demos/` — 前端主项目，Vue 3 + Vite + TypeScript 的演示/作品集站点（部署名 `mapotato`）。
- `server/` — 为 Codepen 页面提供数据的轻量 Node HTTP API（无框架，原生 `node:http`）。

绝大多数开发工作在 `vue-demos/`。所有命令默认在对应包目录下执行。

## 常用命令（vue-demos/）

```sh
npm run dev            # 启动开发服务器（--host，局域网可访问）
npm run build          # 类型检查 + 生产构建（run-p type-check build:prod）
npm run build:prod     # 仅生产构建，输出到 mapotato/
npm run build:analyze  # 构建并打开打包体积分析报告
npm run type-check     # vue-tsc 类型检查
npm run lint           # ESLint 自动修复
npm run format         # Prettier 格式化 src/
npm run preview        # 预览生产构建产物
```

无单元测试框架；验证以 `type-check` + `lint` + `build` 为准。

## 架构要点（vue-demos/）

- 入口 `src/main.ts` 将应用挂载到 `body`（非 `#app`），全局样式为 `src/style.scss`。
- `src/App.vue` 是布局外壳，组合四个布局区块：`LHeader` / `LMain` / `LFooter` / `LPopover`（见 `src/layout/`，通过 `src/layout/index.ts` 桶导出）。移动端 UA 直接显示「请前往 chrome 桌面浏览器」。
- 路由 `src/router/index.ts`：`createWebHistory`，所有页面 `() => import()` 懒加载。新增页面 = 在 `src/views/` 加目录 + 在此注册路由 + 在 `src/layout/layout-header/layout-header.vue` 的 `MENULIST` 加导航项（两处分别维护，注意同步）。
- `LMain` 用 `<router-view>` + `<keep-alive>` 缓存所有页面组件。
- 路径别名 `@` → `src`（在 `vite.config.ts` 与 `tsconfig.json` 同时配置）。

### 全局消息（Popover）

无状态库。全局提示走自实现的轻量方案：

- `src/layout/layout-popover/layout-popover.vue` 在 `onMounted` 时通过 `installMessage` 把自身 `defineExpose` 的实例写入单例。
- 任意组件 `import { message } from '@/common/plugins/message'` 后调用 `message.message('文案', duration?)` 即可弹出提示。

### 公共组件与 hooks

- `src/common/components/index.ts` 桶导出公共组件：`Codepen`、`Editor`（Monaco）、`NestView`、`CollapsePanel`、`TresModelLoader`。
- Monaco 编辑器走按需引入（`src/common/components/mona/customMonaco.ts` 仅引入用到的 contrib），避免全量打包。
- 组合式函数命名为 `useXxx.ts`，就近放在使用它的 view/组件目录下（如 `src/views/index-notes/components/lovely-snake/hooks/`），通用工具函数放 `src/utils/index.ts`。

### 3D / TresJS

- 3D 演示基于 `@tresjs/core` + `@tresjs/cientos` + `@tresjs/post-processing`，底层 `three`。
- `vite.config.ts` 已注入 `templateCompilerOptions`，使 `<TresXxx>` 标签被识别。
- GLTF/GLB 模型放 `public/models/`，含 Draco 解码器（`draco_wasm_wrapper.js`）。通用加载封装见 `src/common/components/tres-model-loader/`。

## 代码规范

- Vue 3 `<script setup lang="ts">` 单文件组件，`<style lang="scss" scoped>`。
- 模板内普通 Vue 组件统一使用小写 kebab-case 标签（如 `<model-loader>`、`<collapse-panel>`），不要使用 PascalCase / 大写标签。自定义组件名不要以 `tres-` 开头，避免被 TresJS 的 `templateCompilerOptions` 当作 3D custom element。TresJS 场景原语（如 `<TresPerspectiveCamera>`）按 TresJS 要求保留。
- Prettier（`.prettierrc.json`）：单引号、`printWidth: 100`、`semi: true`、`tabWidth: 2`、`trailingComma: all`、`arrowParens: avoid`（单参数箭头函数不加括号）。
- ESLint flat config（`eslint.config.js`）：TS 推荐 + Vue3 `flat/recommended` + Prettier。`multi-word-component-names` 关闭，`no-explicit-any` 为 warn，`no-unused-vars` 为 error。生产环境下 `no-console`/`no-debugger` 报错（即提交前应清理调试日志）。
- 样式优先使用 `src/assets/css/var.scss` 中的 CSS 变量（如 `--apple-music-primary`、`--header-h`），整体为 Apple Music 风格暗色主题。
- 环境变量经 Vite 暴露：`.env` 中 `VITE_BASE_URL`，统一在 `src/config/index.ts` 导出。

## 数据 API（server/）

- 单文件 `server/src/index.ts`，原生 `node:http`，默认端口 `3638`。
- 路由：`GET /health`、`GET /api/code-pens`（读取 `server/data/pens.json` 返回 CodePen 列表）。
- 为配合静态站点 `base: /mapotato` 与 Nginx 反代，做了路径前缀剥离与 `X-Original-URI` 兜底（`normalizePathname`）。调试可设 `DEBUG_PATH=1`。
- 开发时前端通过 `vite.config.ts` 的 `/api` 代理转发到 `http://127.0.0.1:3638`。
- 部署：`server/docker-compose.yml`，镜像 `mapotato-api`，可挂载 `./data` 热更新 `pens.json`。

## 部署（vue-demos/）

- 生产 `base: /mapotato`，构建产物输出到 `mapotato/`（非默认 `dist`）。
- `npm run deploy` 串行执行：构建 → 压缩为 `mapotato.zip` → scp 上传至「腾讯云」主机 → 远程解压到 `/var/www/html/mapotato`。该流程依赖本地 SSH host 别名「腾讯云」，需提前配置。
