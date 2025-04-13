/**
 * 从 Markdown 文本中提取摘要
 * @param markdown Markdown 文本
 * @returns 提取的摘要信息
 */
export function getMarkdownAbstract(markdown: string): string {
  // TODO: Use AI to generate abstract
  return markdown.split('\n')[0];
}
