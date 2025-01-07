export type PageIdType = string;

export const PAGE_ID = Object.freeze({
  INDEX: 'INDEX',
  LOGIN: 'LOGIN',
  MANAGE: Object.freeze({
    INDEX: 'MANAGE',
    BLOG: Object.freeze({
      INDEX: 'MANAGE_BLOG',
      ARTICLE: Object.freeze({
        INDEX: 'MANAGE_BLOG_ARTICLE_INDEX',
        ADD: 'MANAGE_BLOG_ARTICLE_ADD',
        MANAGE: 'MANAGE_BLOG_ARTICLE_MANAGE',
        MODIFY: 'MANAGE_BLOG_ARTICLE_MODIFY',
      }),
      CATEGORY: Object.freeze({
        INDEX: 'MANAGE_BLOG_CATEGORY_INDEX',
        ADD: 'MANAGE_BLOG_CATEGORY_ADD',
        MANAGE: 'MANAGE_BLOG_CATEGORY_MANAGE',
      }),
      OPTION: Object.freeze({
        INDEX: 'MANAGE_BLOG_OPTION_INDEX',
        ABOUT: 'MANAGE_BLOG_OPTION_ABOUT',
      }),
    }),
  }),
});
