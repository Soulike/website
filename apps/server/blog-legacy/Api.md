# 接口文档

## 对象

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

### Category

```ts
class Category {
  public id: number; // 自增主键
  public name: string; // 分类名，唯一
}
```

---

## 接口文档

所有接口的均有前缀 `/server`。

### 文章相关（前缀为 `/article`）

#### `/getAllWithAbstract`

- 功能说明：获取所有文章信息，文章内容仅取前 300 个字符
- 请求方法：GET
- 请求对象：无
- 成功响应对象：[`Article`](#article) 实例数组
- 失败响应消息：无
- 其他说明
  - `content` 域截断为前 300 个字符
  - 只返回可见的文章

#### `/getById`

- 功能说明：获取指定 ID 且可见文章信息
- 请求方法：GET
- 请求对象：

```ts
{
    json: { // JSON 串
        id: number,
    }
}
```

- 成功响应对象：[`Article`](#article) 实例
- 失败响应消息
  - 文章不存在：文章不存在
  - 文章不可见：文章不存在
- 其他说明
  - 添加文章浏览量
  - 对用户设置 Cookie，有效期一小时，会话存储用户浏览过的文章 ID。每次访问均查询是否已经浏览过，已浏览过不增加文章浏览量

#### `/getByCategoryWithAbstract`

- 功能说明：获取所有指定分类文章信息，文章内容仅取前 300 个字符
- 请求方法：GET
- 请求对象

```ts
{
    json: { // JSON 串
        category: number,
    }
}
```

- 成功响应对象：[`Article`](#article) 实例数组
- 失败响应消息
  - 分类不存在：文章分类不存在
- 其他说明
  - `content` 域截断为前 300 个字符
  - 只返回可见的文章

### 文章分类相关（前缀为 `/category`）

#### `/getAll`

- 功能说明：获取所有文章分类信息
- 请求方法：GET
- 请求对象：无
- 成功响应对象：[`Category`](#category) 实例数组
- 失败响应消息：无
- 其他说明：无

#### `/getById`

- 功能说明：获取指定 ID 文章分类信息
- 请求方法：GET
- 请求对象

```ts
{
    json: { // JSON 串
        id: number,
    }
}
```

- 成功响应对象：[`Category`](#category) 实例数组
- 失败响应消息：无
- 其他说明：
  - 分类不存在：文章分类不存在

### 设置相关（前缀为 `/option`）

#### `/getAbout`

- 功能说明：获得关于内容
- 请求方法：GET
- 请求对象：无
- 成功响应对象

```ts
{
    about: string,
}
```

- 失败响应消息：无
- 其他说明
  - 如果存储文件不存在返回空字符串
  - 存储在用户文件夹下 `.blog-data` 目录中，文件名为 `about.md`
