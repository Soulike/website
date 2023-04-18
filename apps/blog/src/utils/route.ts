import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/src/config/route';

export function getArticleLink(articleId: number): string {
    return `${PAGE_ID_TO_ROUTE[PAGE_ID.ARTICLE]}/${articleId}`;
}

export function getCategoryLink(categoryId: number): string {
    return `${PAGE_ID_TO_ROUTE[PAGE_ID.CATEGORY]}/${categoryId}`;
}
