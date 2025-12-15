# Article 模块

本模块接口的前缀为 `/article`。

---

## 数据库对象

### Article

```ts
class Article {
  public id: number; // 自增主键
  public title: string; // 文章标题，唯一
  public content: string;
  public category: number; // 文章分类，外键
  public publicationTime: string; // 发表日期，ISO 标准日期字符串，默认值为现在
  public modificationTime: string; // 编辑日期，ISO 标准日期字符串，默认值为现在
  public pageViews: number; // 浏览量，默认值 0
  public isVisible: boolean; // 可见性，默认值 true
}
```

---

## 接口信息

### `/add`

- 功能说明：添加文章
- 请求方法：POST
- 请求对象：`Pick<Article, 'title'|'content'|'category'|'isVisible'>` 实例
- 成功响应对象：无
- 失败响应消息：
  - 文章标题已存在：文章标题已存在，请修改文章标题
  - 文章分类不存在：文章分类不存在，请重新选择分类
- 其他说明：无

### `/deleteById`

- 功能说明：删除指定 ID 文章
- 请求方法：POST
- 请求对象：

```ts
{
    id: number,
}
```

- 成功响应对象：无
- 失败响应消息：
  - 文章不存在：文章不存在
- 其他说明：无

### `/modify`

- 功能说明：修改文章
- 请求方法：POST
- 请求对象：`Pick<Article, 'id'> & Partial<Omit<Article, 'publicationTime' | 'modificationTime' | 'pageViews'>>` 实例
- 成功响应对象：无
- 失败响应消息：
  - 文章不存在：文章不存在
- 其他说明：
  - 当 `content` 域被修改时，`modificationTime` 修改为提交请求的时间

### `/get`

- 功能说明：获取文章
- 请求方法：GET
- 请求对象：

```ts
{
    json: Partial<Article>, // Article 对象的 JSON 串
}
```

- 成功响应对象：`Array<Article>`
- 失败响应消息：无
- 其他说明：
  - 数组按照文章发表时间从晚到早排序

### `/getAll`

- 功能说明：获取所有文章
- 请求方法：GET
- 请求对象：无
- 成功响应对象：`Array<Article>`
- 失败响应消息：无
- 其他说明：
  - 数组按照文章发表时间从晚到早排序

### `/getByDate`

- 功能说明：获取指定日期（区间）的文章
- 请求方法：GET
- 请求对象：

```ts
{
    json: { // JSON 串
        year: number,
        month?: number,
        day?: number,
    }
}
```

- 成功响应对象：`Array<Article>`
- 失败响应消息：
  - 日期不合法：日期无效
- 其他说明：
  - 数组按照文章发表时间从晚到早排序

### `/count`

- 功能说明：获取符合条件文章数量
- 请求方法：GET
- 请求对象：

```ts
{
    json: Partial<Article>, // Article 对象的 JSON 串
}
```

- 成功响应对象：`number`
- 失败响应消息：无
- 其他说明：无

### `/countAll`

- 功能说明：获取文章数量
- 请求方法：GET
- 请求对象：无
- 成功响应对象：`number`
- 失败响应消息：无
- 其他说明：无

### `/addPageView`

- 功能说明：添加文章浏览数
- 请求方法：POST
- 请求对象

```ts
{
    id: number, // 文章 ID
}
```

- 成功响应对象：无
- 失败响应消息：无
- 其他说明：无
