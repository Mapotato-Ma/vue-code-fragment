# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3638
# 与前端 base 一致；若 Nginx 已去掉 /mapotato 前缀、只把 /api 转到本服务，可构建时传 --build-arg 或运行时 -e PUBLIC_BASE=
ENV PUBLIC_BASE=/mapotato

COPY --from=builder /app/dist ./dist
COPY data ./data

RUN chown -R node:node /app
USER node

EXPOSE 3638

CMD ["node", "dist/index.js"]
