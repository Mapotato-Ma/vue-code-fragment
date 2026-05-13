# server（轻量 API）

**TypeScript** 编写，编译为 `dist/` 后由 Node 运行（`node:http`），读取 `data/pens.json`，无 Nest、无 Redis。运行时无 npm 生产依赖，仅需本机 Node。

## 接口（REST）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/code-pens` | 返回 JSON 数组，元素含 `penId`、`name`、可选 `zoom` |
| GET | `/health` | 健康检查 `{"status":"ok"}` |
| 非 GET | `/api/code-pens` | **405** |

默认端口 **3638**（环境变量 `PORT` 可覆盖）。

## 本地运行

```bash
cd server
npm install
npm run dev
```

`dev` 使用 **tsx** 监听 `src/index.ts` 变更。生产或预览编译结果：

```bash
npm run build
npm start
```

`start` 执行 `node dist/index.js`（请先 `build`）。

编辑 `data/pens.json` 维护列表（可从原 Redis `code-pen` 导出后粘贴）。修改文件后**下一次 GET 即生效**（无需重启）。

## 与前端联调

在仓库根目录启动 `vue-demos` 的 `npm run dev` 时，Vite 已将 `/api` 代理到 `http://127.0.0.1:3638`，需同时在本机启动本服务（直接 Node 或下方 Docker 均可）。

## Docker（可选）

需本机已安装 [Docker](https://docs.docker.com/get-docker/) 与 Docker Compose v2。

在 **`server/`** 目录：

```bash
# 构建镜像
npm run docker:build

# 构建并后台启动（默认映射本机 3638 → 容器 3638）
npm run docker:up

# 停止
npm run docker:down
```

- **多阶段构建**：镜像内完成 `npm ci` + `tsc`，运行阶段仅含 **`dist/`**、**`data/`** 与 **Alpine + Node 22**，体积较小。  
- **非 root 运行**：进程用户为 `node`。  
- **改 `pens.json` 不重打镜像**：在 `docker-compose.yml` 中取消 **`volumes: ./data:/app/data:ro`** 的注释，改主机上 `data/pens.json` 后下一次请求即读到新内容（挂载会覆盖镜像内同路径的 `COPY data`）。

### 一条命令部署到服务器（无镜像仓：`save` + `scp` + `load`）

1. 复制 **`.env.docker.deploy.example`** 为 **`.env.docker.deploy`**，填写 `DEPLOY_HOST`、`DEPLOY_USER`、`REMOTE_DIR` 等（说明见文件内注释）。  
2. 本机 **Docker Desktop 已启动**，且能 **`ssh` / `scp`** 到服务器（与现有腾讯云习惯一致）。  
3. 在 **`server/`** 目录执行：

```bash
npm run docker:deploy
```

脚本会依次：**本地 `docker build`** → **`docker save` 为 tar** → **`scp` 到远端 `REMOTE_DIR`** → **远端 `docker load` + 用新镜像重建同名容器**（旧容器会先 `stop` / `rm`）。默认删除本地临时 `mapotato-api.tar`；若要保留，在 `.env.docker.deploy` 中加 **`KEEP_LOCAL_TAR=1`**。

以下为**其他**部署方式（镜像仓、或仅在服务器构建）；若你只用上面一条命令，可跳过。

### 重建镜像后，部署到自有服务器（其他做法）

**共同前提**：服务器已安装 Docker；安全组/防火墙放行 **`3638`**（或你映射到宿主机的端口）；Nginx 的 `proxy_pass` 指向 **`http://127.0.0.1:3638`**（与 `-p 3638:3638` 一致）。

---

**方式一：镜像仓库（适合生产、可回滚版本）**

1. 在 **腾讯云容器镜像服务 TCR**、Docker Hub 等创建仓库，例如 `ccr.ccs.tencentyun.com/你的命名空间/mapotato-api`。  
2. 本地构建并打标签、推送（示例，按你仓库地址改）：

```bash
cd server
docker build -t mapotato-api:local .
docker tag mapotato-api:local ccr.ccs.tencentyun.com/你的命名空间/mapotato-api:latest
docker push ccr.ccs.tencentyun.com/你的命名空间/mapotato-api:latest
```

3. 登录服务器，`docker login` 对应仓库后：

```bash
docker pull ccr.ccs.tencentyun.com/你的命名空间/mapotato-api:latest
docker stop mapotato-api 2>/dev/null; docker rm mapotato-api 2>/dev/null
docker run -d --name mapotato-api --restart unless-stopped -p 3638:3638 \
  ccr.ccs.tencentyun.com/你的命名空间/mapotato-api:latest
```

之后每次本地改代码 → 重建镜像 → **同一套 `tag` + `push`**，到服务器上 **`pull` + 删掉旧容器再 `run` 新镜像**（或用 `docker compose` 指定 `image:` 后 `docker compose pull && docker compose up -d`）。

---

**方式二：`docker save` / `scp` / `docker load`（无镜像仓、手动版）**

与上文 **`npm run docker:deploy`** 步骤相同，仅适合排查或无法跑 PowerShell 脚本时参考。

1. 本地打包镜像为 tar：

```bash
cd server
docker build -t mapotato-api:local .
docker save mapotato-api:local -o mapotato-api.tar
```

2. 上传到服务器（把 `用户`、`服务器` 换成你的 SSH 配置）：

```bash
scp mapotato-api.tar 用户@服务器:/opt/mapotato-api/
```

3. SSH 登录服务器加载并运行：

```bash
ssh 用户@服务器
docker load -i /opt/mapotato-api/mapotato-api.tar
docker stop mapotato-api 2>/dev/null; docker rm mapotato-api 2>/dev/null
docker run -d --name mapotato-api --restart unless-stopped -p 3638:3638 mapotato-api:local
```

以后发了新 tar，重复 **`scp` → `docker load`（会覆盖同名标签）→ 删旧容器 → 再 `docker run`** 即可。

---

**方式三：在服务器上直接构建（适合仓库已 clone 到服务器）**

```bash
cd /path/to/vue-code-fragment/server
git pull
docker compose build --no-cache
docker compose up -d
```

无需在本机传镜像；服务器要能访问 npm registry 以执行 `npm ci`。

---

**关于 `pens.json`**：若希望上线后改列表**不必重建镜像**，在服务器上用 **`docker run` 增加挂载**，例如：

`-v /opt/mapotato-api/data:/app/data:ro`

（目录里放你的 `pens.json`），或与本地 `docker-compose.yml` 里注释的 **`./data:/app/data:ro`** 同理，把主机路径换成服务器上的绝对路径即可。

## Nginx 示例

静态站点与 API 同域时，将 `/api` 反代到本进程。**注意：`proxy_pass` 末尾不要加 `/`**，否则 Nginx 会把 **`/api/` 前缀剥掉**再转发：例如浏览器请求 `/api/code-pens`，会变成转发到 `http://127.0.0.1:3638/code-pens`（Node 里表现为路径 **`/code-pens`**）。本服务已**同时兼容** **`/api/code-pens`** 与误配置时的 **`/code-pens`**；仍建议在反代中增加 **`proxy_set_header X-Original-URI $request_uri;`**，Node 会优先用该头还原浏览器真实路径。

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3638;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Original-URI $request_uri;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
}
```

错误示例（末尾多写了 `/`，会剥前缀）：

```nginx
# 不要这样写
# proxy_pass http://127.0.0.1:3638/;
```

前端若请求 **`/mapotato/api/code-pens`**，需增加（且写在 **`location /mapotato/`** 静态回退**之前**）：

```nginx
location ^~ /mapotato/api/ {
    proxy_pass http://127.0.0.1:3638;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Original-URI $request_uri;
    proxy_set_header X-Real-IP $remote_addr;
}
```

若容器里 **`PUBLIC_BASE=`** 为空、但 Nginx 仍把带 **`/mapotato`** 的完整路径传到 Node，会匹配不到路由。可去掉空的 `PUBLIC_BASE`，或依赖服务端对 **`/mapotato`** 的剥离逻辑。排查：进程加 **`DEBUG_PATH=1`** 时会在 stderr 打路径；**404 响应体**也会带上 `rawPath`、`normalizedPath` 等字段（勿在生产长期开启）。
