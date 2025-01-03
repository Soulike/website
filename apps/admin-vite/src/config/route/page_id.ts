export const PAGE_ID = Object.freeze({
  INDEX: Symbol('INDEX'),
  LOGIN: Symbol('LOGIN'),
  MANAGE: Object.freeze({
    INDEX: Symbol('MANAGE'),
    BLOG: Object.freeze({
      INDEX: Symbol('BLOG'),
      ARTICLE: Object.freeze({
        INDEX: Symbol('BLOG_ARTICLE_INDEX'),
        ADD: Symbol('BLOG_ARTICLE_ADD'),
        MANAGE: Symbol('BLOG_ARTICLE_MANAGE'),
        MODIFY: Symbol('BLOG_ARTICLE_MODIFY'),
      }),
      CATEGORY: Object.freeze({
        INDEX: Symbol('BLOG_CATEGORY_INDEX'),
        ADD: Symbol('BLOG_CATEGORY_ADD'),
        MANAGE: Symbol('BLOG_CATEGORY_MANAGE'),
      }),
      OPTION: Object.freeze({
        INDEX: Symbol('BLOG_OPTION_INDEX'),
        ABOUT: Symbol('BLOG_OPTION_ABOUT'),
      }),
    }),
  }),
});
