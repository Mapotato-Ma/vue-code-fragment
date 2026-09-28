export interface Topic {
  id: TopicId;
  label: string;
}

export const TOPICS = [
  { id: 'js', label: 'JavaScript' },
  { id: 'css', label: 'CSS' },
  { id: 'vue', label: 'Vue & 框架' },
  { id: 'ts', label: 'TypeScript & 构建' },
  { id: 'browser', label: '浏览器' },
  { id: 'tool', label: '开发工具链' },
  { id: 'ops', label: 'Git & 服务器' },
] as const satisfies readonly { id: string; label: string }[];

export type TopicId = (typeof TOPICS)[number]['id'];

export const TOPIC_BY_FILE: Record<string, TopicId> = {
  '1.md': 'js',
  '2.md': 'browser',
  '3.md': 'browser',
  '4.md': 'js',
  '5.md': 'tool',
  '6.md': 'css',
  '7.md': 'ops',
  '8.md': 'ops',
  '9.md': 'tool',
  '10.md': 'browser',
  '11.md': 'vue',
  '12.md': 'vue',
  '13.md': 'ops',
  '14.md': 'ops',
  '15.md': 'vue',
  '16.md': 'ts',
  '17.md': 'tool',
  '18.md': 'css',
  '19.md': 'vue',
  '20.md': 'tool',
  '21.md': 'css',
  '22.md': 'tool',
  '23.md': 'vue',
  '24.md': 'ops',
  '25.md': 'tool',
  '26.md': 'css',
  '27.md': 'browser',
  '28.md': 'js',
  '29.md': 'css',
};

const TOPIC_MAP = new Map(TOPICS.map(t => [t.id, t]));
export const getTopic = (id: TopicId) => TOPIC_MAP.get(id);

const FALLBACK_TOPIC: Readonly<Topic> = { id: '_uncategorized' as TopicId, label: '未分类' };
export const getTopicOrFallback = (id: string): Topic =>
  TOPIC_MAP.get(id as TopicId) ?? ((console.warn(`[Notes] 笔记未分类: ${id}`), FALLBACK_TOPIC) as unknown as Topic);