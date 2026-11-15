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
    json: Partial<Category>, // 至少包含一个白名单筛选字段
}
```

- 成功响应：`data` 为 `Category[]`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
- 其他说明：
  - 空筛选对象或未知字段将被拒绝

### `/getAll`

- 功能说明：获取所有分类
- 请求方法：GET
- 请求对象：无
- 成功响应：`data` 为 `Category[]`
- 失败响应错误码：无
- 其他说明：无

### `/add`

- 功能说明：添加分类
- 请求方法：POST
- 请求对象：`CategoryDraft`（`name`）
- 成功响应：`data` 为 `null`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 分类名重复：`CATEGORY_ALREADY_EXISTS`
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

- 成功响应：`data` 为 `null`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 分类不存在：`CATEGORY_NOT_FOUND`
  - 文章分类下仍有文章存在：`CATEGORY_IN_USE`（`details: { articleAmount }`）
- 其他说明：无

### `/modify`

- 功能说明：编辑分类
- 请求方法：POST
- 请求对象：`UpdateCategory`（`id` 与 `name`）
- 成功响应：`data` 为 `null`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 分类 ID 不存在：`CATEGORY_NOT_FOUND`
  - 分类名重复：`CATEGORY_ALREADY_EXISTS`
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

- 成功响应：`data` 为 `number`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 分类 ID 不存在：`CATEGORY_NOT_FOUND`
- 其他说明：无
