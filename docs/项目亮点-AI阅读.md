# vue-code-fragment 项目亮点与上下文（供 AI 阅读）

> 本文档面向后续接入本仓库的 AI：概括仓库目的、技术栈、模块划分与可复用亮点，便于快速建立心智模型与定位代码。

---

## 1. 仓库定位

- **一句话**：基于 **Vue 3 + Vite + TypeScript** 的演示与实验集合（品牌/路径上常出现 **mapotato**），以独立页面展示多种前端能力：3D、图表搭建、编辑器、笔记与小组件画廊。
- **根 README**：见仓库根目录 `README.md`；主应用在 `vue-demos/`，另含轻量 **TypeScript** 服务 `server/`（编译后 Node 运行，提供 REST API）。

---

## 2. 目录与职责

| 路径 | 职责 |
|------|------|
| `vue-demos/` | 主前端：Vite 构建、路由、各 demo 视图、`src/common` 共享组件与钩子 |
| `server/` | **TypeScript** + Node：`src/index.ts` → **`dist/`**；**`GET /api/code-pens`**；**Docker** 部署（`Dockerfile`、`docker-compose.yml`，远端一键 **`npm run docker:deploy`** + `.env.docker.deploy`）。开发时 Vite 将 `/api` 代理到 `127.0.0.1:3638`。详见 `server/README.md` |
| 根 `README.md` | 项目简述 |

---

## 3. 技术栈摘要（`vue-demos/package.json`）

- **框架**：Vue 3（`<script setup>`）、Vue Router 4  
- **构建**：Vite；`@vitejs/plugin-vue` + **JSX**；`vite-plugin-markdown`（Markdown 作为模块导入）；`vite-plugin-ejs`；`vite-plugin-wasm`  
- **3D**：`three`、`@tresjs/core`、`@tresjs/cientos`、`@tresjs/post-processing`（含 Bloom 等后处理）  
- **可视化与交互**：`vue-data-ui`（图表）、`vue-draggable-plus`（拖拽布局）、`@vueuse/core` / `@vueuse/components`  
- **编辑器**：`monaco-editor`（配合 **ESM 按需子路径** + **Worker** 自注册，见 `customMonaco.ts`）、`monaco-themes`  
- **其他**：`vue-showdown`、`highlight.js`、`rxjs`、`big.js`、`vue-icons-plus`  
- **类型与质量**：`vue-tsc` 与 `build` 脚本中并行类型检查；ESLint / Prettier  

依赖中存在 `@mapotato-pkg/hello-wasm` 与 `vite-plugin-wasm`：以 WASM 扩展构建能力；若排查「wasm 相关」需结合 `vite.config` 与具体引用点（当前业务代码里 Draco 解码路径见下文 3D 小节）。

---

## 4. 构建与部署特征

- **`vite.config.ts`**：`base: '/mapotato'`，`build.outDir: 'mapotato'`，与静态资源路径一致（如模型 `mapotato/models/...`）；**`server.proxy['/api']`** 指向 `http://127.0.0.1:3638` 便于与 `server` 联调。  
- **可选包体分析**：`build:analyze` + `vite-bundle-analyzer`，产出静态报告。  
- **`package.json` deploy 链**：`build:prod` → PowerShell 打 zip → `scp` 至腾讯云路径 → 远程 `unzip`（环境相关，AI 修改部署脚本前需确认用户主机配置）。  

---

## 5. 路由与功能地图（`src/router/index.ts` + 顶栏 `layout-header`）

| 路由 | 用户可见名称 | 内容概要 |
|------|----------------|----------|
| `/home` | Home | 首页：`Suspense` + **Tres 画布**加载 GLB，欢迎文案 **CSS `@starting-style`** 入场动画；渲染循环中缩放模型 |
| `/index-notes` | Demo | **CSS Grid** 拼盘，内嵌多个自研小组件（有向图、双边连线、选择器、可拖拽布局、贪吃蛇、霓虹球、随机梯形 SVG 等），路径 `views/index-notes/` |
| `/codepen-notes` | Codepen | 网格嵌入 **CodePen iframe** 组件；列表来自 **`GET /api/code-pens`**（Vite dev 代理至本机 `server`） |
| `/juejin-notes` | Notes | **`import.meta.glob('./articles/*.md', { eager: true })`** 聚合 Markdown；`vue-showdown` 渲染；目录 + hash 锚点；`UseFullscreen` 单文全屏 |
| `/json-viewer` | JSON | **Monaco** 左侧编辑 JSON 字符串，右侧 **树形 NestView**；中间 **24 格**点击调节左右栏比例 |
| `/rhythmic` | Beat | **RxJS** `timer` + `filter`/`take` 驱动节拍与 **HTMLAudioElement** 采样，可视化节拍块 |
| `/earth` | Earth | 另一套 **Tres + GLTF**，开启 Bloom；`useModelUtil` 驱动旋转动画 |
| `/easy-chart-builder` | Charts | **vue-data-ui**（折线/柱/饼）+ **vue-draggable-plus** 的可编辑看板：编辑模式、增删图、拖拽与简单缩放逻辑 |

---

## 6. 架构与体验上的亮点（便于 AI「找亮点」）

### 6.1 应用壳层

- **`App.vue`**：非手机 UA 显示完整 `LHeader` / `LMain` / `LFooter` / `LPopover`；移动端提示使用桌面 Chrome（产品向取舍，非响应式全适配）。  
- **`layout-main`**：`router-view` 外包 **`keep-alive`**，多页切换保留状态。  

### 6.2 3D 管线（可复用封装）

- **`TresCanvas` + `OrbitControls` + 自定义 `GltfModelLoader`**：`gltf-model-loader.vue` 使用 `useLoader(GLTFLoader, ...)`，并 **`DRACOLoader` + 本地 `setDecoderPath('mapotato/models/')`**，避免 Draco WASM 默认走外网 CDN 的失败场景（与 `articles` 中一篇技术笔记主题一致）。  
- **后处理**：条件渲染 `EffectComposerPmndrs` + `BloomPmndrs`（地球页示例强度配置）。  
- **钩子**：`useModelUtil` 等与动画/缩放相关的状态复用。  

### 6.3 Monaco 集成方式

- **`customMonaco.ts`**：仅引入所需 editor contrib 与 **json** language，减小打包。  
- **`editor.vue`**：`?worker` 注入 `MonacoEnvironment.getWorker`，主题从 `monaco-themes` 异步加载。  
- 与 **JSON 可视化**联动：失焦或外部同步策略在 `watch` 中通过 `document.activeElement` 避免与用户编辑冲突。  

### 6.4 内容型页面

- **掘金风格笔记**：Markdown 即源码、构建期聚合；标题从首行 `#` 解析；`BASE_URL` 来自 `VITE_BASE_URL`（`src/config/index.ts`）。  
- **CodePen 画廊**：iframe 懒加载、可全屏；列表来自 **`GET /api/code-pens`**，数据维护在 `server/data/pens.json`（改文件即生效，无需 Redis）。  

### 6.5 Demo 页技术密度

- `index-notes` 单页聚合 **图布局、连线、游戏循环、SVG 程序化生成、霓虹动效** 等，适合作为「组件样例集市」阅读入口。  

### 6.6 工程化

- `build`：`run-p` 并行 **type-check** 与 **vite build**。  
- 路径别名 `@` → `src`。  

---

## 7. 后端 `server/`（Node + TypeScript）

- **实现**：源码 `src/index.ts`，`npm run build` 输出 **`dist/`**，生产入口 **`node dist/index.js`**；开发可用 **`npm run dev`**（`tsx watch`）。  
- **REST**：`GET /api/code-pens` 返回 JSON 数组（`penId`、`name`、可选 `zoom`）；对同路径非 GET 返回 **405**；`GET /health` 健康检查。  
- **数据**：`server/data/pens.json`（根节点为数组）。默认端口 **3638**（`PORT` 环境变量）。  
- **部署**：配置 **`.env.docker.deploy`** 后执行 **`npm run docker:deploy`**（本地构建镜像 → `save` → `scp` → 远端 `load` 并启动容器）；本地仅起容器可用 **`npm run docker:up`**。详见 [`server/README.md`](server/README.md)。  

---

## 8. AI 协作时的建议检索入口

| 需求 | 建议路径 |
|------|----------|
| 路由与页面注册 | `vue-demos/src/router/index.ts` |
| 导航与菜单文案 | `vue-demos/src/layout/layout-header/layout-header.vue` |
| 3D 加载与 Draco | `vue-demos/src/common/components/tres-model-loader/gltf-model-loader.vue` |
| Monaco 精简打包 | `vue-demos/src/common/components/mona/customMonaco.ts`、`editor.vue` |
| JSON 树 + 分栏 | `vue-demos/src/views/json-view/json-view.vue`、`common/components/nest-view/` |
| Markdown 笔记数据 | `vue-demos/src/views/juejin-notes/articles/*.md`、`juejin-notes.vue` |
| 小组件集合 | `vue-demos/src/views/index-notes/` |
| 图表看板 | `vue-demos/src/views/easy-chart-builder/easy-chart-builder.vue` |
| CodePen API | `server/src/index.ts`（编译输出 `server/dist/`）、`server/data/pens.json` |
| 后端容器化 | `server/Dockerfile`、`server/docker-compose.yml`；一键远端：`npm run docker:deploy`（需 `.env.docker.deploy`） |

---

## 9. 已知注意点（减少 AI 误判）

- **`/api/*`**：开发环境由 [`vue-demos/vite.config.ts`](vue-demos/vite.config.ts) 代理到本机 `3638`；生产需 Nginx 等同源反代。  
- **`server`** 与 **`vue-demos`** 可独立运行；本地查看 CodePen 页需 **同时** 启动 `server`（`npm start`），生产环境需 Nginx 将 `/api` 反代到该进程。  
- **`git status` 中大量 `vue-demos/dist/`**：多为构建产物；判断是否纳入版本控制应以用户 `.gitignore` 策略为准。  

---

## 10. 文档维护

- 若新增路由、依赖或部署方式，请同步更新本文件 **第 5、3、4 节** 对应表格与列表，便于后续 AI 与人类快速对齐上下文。

---

*生成说明：基于仓库源码与配置梳理，非运行时探测；日期以用户环境为准。*
