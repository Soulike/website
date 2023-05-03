import {PAGE_ID} from './PAGE_ID';

export const PAGE_ID_TO_ROUTE = {
    [PAGE_ID.LOGIN]: '/',

    [PAGE_ID.MANAGE.INDEX]: '/manage',

    [PAGE_ID.MANAGE.BLOG.INDEX]: '/manage/blog',

    [PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX]: '/manage/blog/article',
    [PAGE_ID.MANAGE.BLOG.ARTICLE.ADD]: '/manage/blog/article/add',
    [PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE]: '/manage/blog/article/manage',
    [PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]: '/manage/blog/article/modify',

    [PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX]: '/manage/blog/category',
    [PAGE_ID.MANAGE.BLOG.CATEGORY.ADD]: '/manage/blog/category/add',
    [PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE]: '/manage/blog/category/modify',

    [PAGE_ID.MANAGE.BLOG.OPTION.INDEX]: '/manage/blog/option',
    [PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]: '/manage/blog/option/about',
};
