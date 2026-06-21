import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_PREFIX = 'access';
const MAX_LINES = Number(process.env.LOG_MAX_LINES) || 500;

let currentFile = '';
let lineCount = 0;
let writeQueue: Promise<void> = Promise.resolve();
let ready = false;

function countLines(content: string): number {
  if (!content) return 0;
  const n = (content.match(/\n/g) ?? []).length;
  return content.endsWith('\n') ? n : n + 1;
}

function parseFileIndex(filename: string): number {
  const m = filename.match(new RegExp(`^${LOG_PREFIX}-(\\d+)\\.log$`));
  return m ? Number(m[1]) : 0;
}

function formatFileIndex(index: number): string {
  return `${LOG_PREFIX}-${String(index).padStart(3, '0')}.log`;
}

async function pickCurrentFile(): Promise<void> {
  await fs.mkdir(LOG_DIR, { recursive: true });

  const files = (await fs.readdir(LOG_DIR))
    .filter(name => name.startsWith(`${LOG_PREFIX}-`) && name.endsWith('.log'))
    .sort((a, b) => parseFileIndex(a) - parseFileIndex(b));

  if (files.length === 0) {
    currentFile = path.join(LOG_DIR, formatFileIndex(1));
    lineCount = 0;
    return;
  }

  const latest = files[files.length - 1];
  currentFile = path.join(LOG_DIR, latest);
  const content = await fs.readFile(currentFile, 'utf8');
  lineCount = countLines(content);

  if (lineCount >= MAX_LINES) {
    const nextIndex = parseFileIndex(latest) + 1;
    currentFile = path.join(LOG_DIR, formatFileIndex(nextIndex));
    lineCount = 0;
  }
}

async function rotateFile(): Promise<void> {
  const nextIndex = parseFileIndex(path.basename(currentFile)) + 1;
  currentFile = path.join(LOG_DIR, formatFileIndex(nextIndex));
  lineCount = 0;
}

/** 启动时初始化日志目录与当前文件 */
export async function initAccessLogger(): Promise<void> {
  try {
    await pickCurrentFile();
    ready = true;
  } catch (err) {
    ready = false;
    console.error('[logger] 初始化失败:', err instanceof Error ? err.message : err);
  }
}

/** 写入一行访问日志（异步串行，避免并发写冲突） */
export function logAccess(line: string): void {
  if (!ready) return;

  writeQueue = writeQueue
    .then(async () => {
      if (lineCount >= MAX_LINES) {
        await rotateFile();
      }
      await fs.appendFile(currentFile, `${line}\n`, 'utf8');
      lineCount += 1;
    })
    .catch(err => {
      console.error('[logger] 写入失败:', err instanceof Error ? err.message : err);
    });
}
