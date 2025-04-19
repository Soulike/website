import path from 'node:path';

import {Article, Category} from '@website/classes';

import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

/**
 * 获取文章链接
 * @param articleId 文章ID
 * @returns 文章链接
 */
export function getArticleLink(articleId: Article['id']): string {
  return path.join(PAGE_ID_TO_PATH[PAGE_ID.ARTICLE], articleId.toString());
}

/**
 * 获取分类链接
 * @param categoryId 分类ID
 * @returns 分类链接
 */
export function getCategoryLink(categoryId: Category['id']): string {
  return path.join(PAGE_ID_TO_PATH[PAGE_ID.CATEGORY], categoryId.toString());
}
