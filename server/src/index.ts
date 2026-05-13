import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 与 `vue-demos` Codepen 页约定一致 */
export interface CodePenItem {
  penId: string;
  name: string;
  zoom?: number;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '..', 'data', 'pens.json');
const PORT = Number(process.env.PORT) || 3638;

/** 与静态站点 base 对齐；空字符串表示「不剥前缀」（Docker 可用 -e PUBLIC_BASE=） */
const PUBLIC_BASE = (process.env.PUBLIC_BASE ?? '/mapotato').replace(/\/$/, '');

/** 优先用反代传入的原始 URI（需在 Nginx 配 X-Original-URI），避免中间层改写 req.url */
function readRequestPathname(req: http.IncomingMessage, host: string): string {
  const orig = req.headers['x-original-uri'];
  if (typeof orig === 'string' && orig.startsWith('/')) {
    const q = orig.indexOf('?');
    return q === -1 ? orig : orig.slice(0, q);
  }
  const raw = req.url ?? '/';
  return new URL(raw, `http://${host}`).pathname;
}

function normalizePathname(pathname: string): string {
  let p = pathname.replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/';
  for (let i = 0; i < 3; i++) {
    if (PUBLIC_BASE && (p === PUBLIC_BASE || p.startsWith(`${PUBLIC_BASE}/`))) {
      p = p.slice(PUBLIC_BASE.length) || '/';
    }
    if (p.startsWith('/mapotato/') || p === '/mapotato') {
      p = p.slice('/mapotato'.length) || '/';
    } else {
      break;
    }
  }
  if (!p.startsWith('/')) p = `/${p}`;
  return p;
}

/** 是否为 CodePen 列表接口（含 Nginx 误剥 /api 后只剩 /code-pens 的情况） */
function isCodePensListPath(pathname: string): boolean {
  return pathname === '/api/code-pens' || pathname === '/code-pens';
}

async function readPens(): Promise<CodePenItem[]> {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error('pens.json 根节点必须是数组');
  }
  return data as CodePenItem[];
}

const server = http.createServer((req, res) => {
  void handleRequest(req, res);
});

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const host = req.headers.host ?? 'localhost';
  const rawPath = readRequestPathname(req, host);
  const pathname = normalizePathname(rawPath);
  if (process.env.DEBUG_PATH === '1') {
    console.error('[http]', req.method, 'url=', req.url, 'x-original-uri=', req.headers['x-original-uri'], 'rawPath=', rawPath, 'norm=', pathname);
  }

  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok' } satisfies { status: string }));
    return;
  }

  if (isCodePensListPath(pathname)) {
    if (req.method === 'GET') {
      try {
        const pens = await readPens();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(pens));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: message }));
      }
      return;
    }

    res.writeHead(405, {
      Allow: 'GET',
      'Content-Type': 'application/json; charset=utf-8',
    });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  if (process.env.DEBUG_PATH === '1') {
    res.end(
      JSON.stringify({
        error: 'Not Found',
        url: req.url ?? null,
        xOriginalUri: req.headers['x-original-uri'] ?? null,
        rawPath,
        normalizedPath: pathname,
        hint: 'Set DEBUG_PATH=0 in prod. Add proxy_set_header X-Original-URI $request_uri; check proxy_pass has no trailing slash.',
      }),
    );
    return;
  }
  res.end(JSON.stringify({ error: 'Not Found' }));
}

server.listen(PORT, () => {
  console.log(`code-pens API listening on http://127.0.0.1:${PORT}`);
});
