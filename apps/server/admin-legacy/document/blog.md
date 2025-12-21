# 博客模块

## 主要功能

本模块主要负责博客模块的管理。

### 文章

- 文章添加
- 文章删除
- 文章编辑

### 分类

- 分类添加
- 分类删除
- 分类修改

---

## 对象

当请求对象中特定值为 `undefined` 时，代表采用数据库现存的值或默认值。

当请求对象中特定值为 `null` 时，代表在数据库中存储 `NULL` 值。

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

本模块的接口前缀为 `/blog`。

### 文章（`/article`）

#### `/getById`

- 功能说明：根据 ID 找到对应文章
- 请求方法：GET
- 请求对象：

```ts
{
    json: {         // JSON 串
        id: number,
    },
}
```

- 成功响应对象：[Article](#article) 实例
- 失败响应消息
  - 未登录：请先登录
  - 文章不存在：文章不存在
- 其他说明：无

#### `/getAll`

- 功能说明：得到所有文章
- 请求方法：GET
- 请求对象：无
- 成功响应对象：[Article](#article) 实例数组
- 失败响应消息
  - 未登录：请先登录
- 其他说明：无

#### `/getByCategory`

- 功能说明：得到所有指定分类下的文章
- 请求方法：GET
- 请求对象：

```ts
{
    json: {     // JSON 串
        category: number,
    },
}
```

- 成功响应对象：[Article](#article) 实例数组
- 失败响应消息：
  - 未登录：请先登录
- 其他说明：无

#### `/add`

- 功能说明：添加文章
- 请求方法：POST
- 请求对象：`Pick<Article, 'title' | 'content' | 'category' | 'isVisible'>` 实例
- 成功响应对象：无
- 失败响应消息
  - 未登录：请先登录
- 其他说明
  - 数据库层已做参数检查

#### `/deleteById`

- 功能说明：删除文章
- 请求方法：POST
- 请求对象：

```ts
{
  id: number;
}
```

- 成功响应对象：无
- 失败响应消息
  - 未登录：请先登录
- 其他说明：无

#### `/modify`

- 功能说明：修改文章
- 请求方法：POST
- 请求对象：`Pick<Article, 'id'> & Partial<Omit<Article, 'publicationTime' | 'modificationTime' | 'pageViews'>>` 实例
- 成功响应对象：无
- 失败响应消息
  - 未登录：请先登录
- 其他说明：无

### 分类（`/category`）

#### `/getById`

- 功能说明：根据 ID 获取文章分类信息
- 请求方法：GET
- 请求对象：

```ts
{
    json: { // JSON 串
        id: number,
    },
}
```

- 成功响应对象：[Category](#category) 实例
- 失败响应消息
  - id 不存在：文章分类不存在
- 其他说明：无

#### `/getAll`

- 功能说明：得到所有文章分类
- 请求方法：GET
- 请求对象：无
- 成功响应对象：[Category](#category) 实例数组
- 失败响应消息
  - 未登录：请先登录
- 其他说明：无

#### `/getAllArticleAmountById`

- 功能说明：得到所有文章分类有多少个文章
- 请求方法：GET
- 请求对象：无
- 成功响应对象：

```ts
{
    [id]: number;   // ID: 文章数量
}
```

- 失败响应消息
  - 未登录：请先登录
- 其他说明：无

#### `/getArticleAmountById`

- 功能说明：得到 ID 对应文章分类有多少个文章
- 请求方法：GET
- 请求对象：

```ts
{
    json: { // JSON 串
        id: number,
    },
}
```

- 成功响应对象：`number` 实例
- 失败响应消息
  - 未登录：请先登录
- 其他说明：无

#### `/add`

- 功能说明：添加文章分类
- 请求方法：POST
- 请求对象：`Omit<Category, 'id'>` 实例
- 成功响应对象：无
- 失败响应消息
  - 未登录：请先登录
- 其他说明
  - 参数检查在数据库层

#### `/deleteById`

- 功能说明：根据 ID 删除文章分类
- 请求方法：POST
- 请求对象：

```ts
{
  id: number;
}
```

- 成功响应对象：无
- 失败响应消息：无
- 其他说明：无

#### `/modify`

- 功能说明：修改文章分类
- 请求方法：POST
- 请求对象：`Partial<Category> & Pick<Category, 'id'>` 实例
- 成功响应对象：无
- 失败响应消息：无
- 其他说明
  - 参数检查在数据库层

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

#### `/setAbout`

- 功能说明：设置关于内容
- 请求方法：POST
- 请求对象

```ts
{
    about: string,
}
```

- 成功响应对象：无
- 失败响应消息：无
- 其他说明
  - 如果存储文件不存在，创建新的并存储
  - 如果存储文件已存在，覆盖存储
  - 存储在用户文件夹下 `.blog-data` 目录中，文件名为 `about.md`
