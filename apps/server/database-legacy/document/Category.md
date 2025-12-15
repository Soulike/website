# Category 模块

本模块接口的前缀为 `/category`

---

## 数据库对象

### Category

```ts
class Category {
  public id: number; // 自增主键
  public name: string; // 分类名，唯一
}
```

---

## 接口信息

### `/get`

- 功能说明：获取特定条件分类
- 请求方法：GET
- 请求对象：

```ts
{
    json: Partial<Category>, // Category 对象 JSON 串
}
```

- 成功响应对象：`Category[]`
- 失败响应消息：
  - 分类不存在：分类不存在
- 其他说明：
  - 如果没有筛选条件，返回空数组

### `/getAll`

- 功能说明：获取所有分类
- 请求方法：GET
- 请求对象：无
- 成功响应对象：`Array<Category>`
- 失败响应消息：无
- 其他说明：无

### `/add`

- 功能说明：添加分类
- 请求方法：POST
- 请求对象：`Omit<Category, 'id'>` 实例
- 成功响应对象：无
- 失败响应消息：
  - 分类名重复：分类已存在
- 其他说明：无

### `/deleteById`

- 功能说明：根据 ID 删除分类
- 请求方法：POST
- 请求对象：

```ts
{
    id: number,
}
```

- 成功响应对象：无
- 失败响应消息：
  - 分类不存在：分类不存在
  - 文章分类下仍有文章存在：文章分类 ${文章分类名} 仍被 ${使用该分类文章数量} 个文章使用，删除失败
- 其他说明：无

### `/modify`

- 功能说明：编辑分类
- 请求方法：POST
- 请求对象：`Partial<Category> & Pick<Category, 'id'>` 实例
- 成功响应对象：无
- 失败响应消息：无
  - 分类 ID 不存在：分类不存在
  - 分类名重复：分类已存在
- 其他说明：无

### `/countArticleById`

- 功能说明：根据分类 ID，查询该分类下有多少篇文章
- 请求方法：GET
- 请求对象：

```ts
{
    json: {         // JSON 串
        id: number,
    }
}
```

- 成功响应对象：`number`
- 失败响应消息：
  - 分类 ID 不存在：分类不存在
- 其他说明：无
