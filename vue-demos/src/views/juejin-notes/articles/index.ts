const markdownFiles = import.meta.glob('./*.md', { as: 'raw' });

export const getArticles = async () => {
  const articles: string[] = [];
  try {
    for (const path in markdownFiles) {
      articles.push(await markdownFiles[path]());
    }
  } catch (error) {
    console.log('🚀 ~ 导入文章失败 ~ 10行', error);
  }
  return articles;
};
