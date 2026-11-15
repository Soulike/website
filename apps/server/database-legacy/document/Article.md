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
- 请求对象：`ArticleDraft`（`title`、`content`、`category`、`isVisible`）
- 成功响应：`data` 为 `null`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 文章标题已存在：`ARTICLE_TITLE_ALREADY_EXISTS`
  - 文章分类不存在：`ARTICLE_CATEGORY_NOT_FOUND`
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

- 成功响应：`data` 为 `null`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 文章不存在：`ARTICLE_NOT_FOUND`
- 其他说明：无

### `/modify`

- 功能说明：修改文章
- 请求方法：POST
- 请求对象：`UpdateArticle`（`id` 与至少一个可修改字段）
- 成功响应：`data` 为 `null`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 文章不存在：`ARTICLE_NOT_FOUND`
- 其他说明：
  - 空更新将被拒绝（`INVALID_REQUEST_PARAMS`）
  - 当 `content` 域被修改时，`modificationTime` 修改为提交请求的时间

### `/get`

- 功能说明：获取文章
- 请求方法：GET
- 请求对象：

```ts
{
    json: Partial<Article>, // 至少包含一个白名单筛选字段
}
```

- 成功响应：`data` 为 `Article[]`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
- 其他说明：
  - 空筛选对象或未知字段将被拒绝
  - 数组按照文章发表时间从晚到早排序

### `/getAll`

- 功能说明：获取所有文章
- 请求方法：GET
- 请求对象：无
- 成功响应：`data` 为 `Article[]`
- 失败响应错误码：无
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

- 成功响应：`data` 为 `Article[]`
- 失败响应错误码：
  - 缺少 `json` 或 JSON 语法错误：HTTP 400，`INVALID_REQUEST_PARAMS`
  - 查询不是对象、缺少年份、字段类型错误，或提供日期但未提供月份：HTTP 200，`INVALID_REQUEST_PARAMS`
  - 日期字段不是有限整数、月份越界，或完整日期不合法：HTTP 200，`INVALID_DATE`
- 其他说明：
  - 支持仅查询年份、查询年份和月份，或查询完整的年、月、日
  - `year` 必填；`month`、`day` 可选，但提供 `day` 时必须同时提供 `month`
  - 所有提供的日期字段必须是数值类型的有限整数，不接受字符串或 `null`
  - 月份取值为 1–12；完整日期必须是有效且在支持范围内的 ISO 日历日期，包括闰年规则
  - 数组按照文章发表时间从晚到早排序

### `/count`

- 功能说明：获取符合条件文章数量
- 请求方法：GET
- 请求对象：

```ts
{
    json: Partial<Article>, // 至少包含一个白名单筛选字段
}
```

- 成功响应：`data` 为 `number`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
- 其他说明：
  - 空筛选对象或未知字段将被拒绝

### `/countAll`

- 功能说明：获取文章数量
- 请求方法：GET
- 请求对象：无
- 成功响应：`data` 为 `number`
- 失败响应错误码：无
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

- 成功响应：`data` 为 `null`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 文章不存在：`ARTICLE_NOT_FOUND`
- 其他说明：无
