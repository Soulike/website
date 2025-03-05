interface ArticleBase {
  title: string;
  content: string;
  category: number;
  isVisible: boolean;
}

type Nullable<T> = {[key in keyof T]: T[key] | null};

/**
 * Describe the properties of an article generated by user.
 */
export class NewArticle implements ArticleBase {
  public category: number;
  public content: string;
  public isVisible: boolean;
  public title: string;

  constructor(
    category: number,
    content: string,
    isVisible: boolean,
    title: string,
  ) {
    this.category = category;
    this.content = content;
    this.isVisible = isVisible;
    this.title = title;
  }

  public static validateFormInput(
    newArticle: Partial<Nullable<NewArticle>>,
    onValidationFailed?: (message: string) => void,
  ) {
    const {title, content, category, isVisible} = newArticle;
    let validationPassed = true;
    if (!title) {
      onValidationFailed?.('Please input title');
      validationPassed = false;
    }
    if (!content) {
      onValidationFailed?.('Please input content');
      validationPassed = false;
    }
    if (category === null) {
      onValidationFailed?.('Please select a category');
      validationPassed = false;
    }
    if (isVisible === null) {
      onValidationFailed?.('Please select article visibility');
      validationPassed = false;
    }
    return validationPassed;
  }
}

/**
 * Describe the properties of an article from database.
 */
export class Article implements ArticleBase {
  public id: number; // 自增主键
  public title: string; // 文章标题，唯一
  public content: string;
  public category: number; // 文章分类，外键
  public publicationTime: string; // 发表日期，ISO 标准日期字符串，默认值为现在
  public modificationTime: string; // 编辑日期，ISO 标准日期字符串，默认值为现在
  public pageViews: number; // 浏览量，默认值 0
  public isVisible: boolean; // 可见性，默认值 true

  constructor(
    id: number,
    title: string,
    content: string,
    category: number,
    publicationTime: string,
    modificationTime: string,
    pageViews: number,
    isVisible: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.category = category;
    this.publicationTime = publicationTime;
    this.modificationTime = modificationTime;
    this.pageViews = pageViews;
    this.isVisible = isVisible;
  }

  static from(obj: Article): Article {
    return new Article(
      obj.id,
      obj.title,
      obj.content,
      obj.category,
      obj.publicationTime,
      obj.modificationTime,
      obj.pageViews,
      obj.isVisible,
    );
  }
}
