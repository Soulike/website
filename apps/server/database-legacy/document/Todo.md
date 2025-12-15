# Todo 模块

本模块接口的前缀为 `/todo`。

---

## 数据库对象

### Todo

```ts
class Todo {
  public id: number;
  public time: string; // 事项创建时间
  public done: boolean; // 是否已经完成
  public title: string; // 事项标题
  public description: string | null; // 事项备注
}
```

---

## 接口信息

### `/add`

- 功能说明：添加事项
- 请求方法：POST
- 请求对象：`Omit<Todo, 'id'>` 实例
- 成功响应对象：无
- 失败响应消息：无
- 其他说明：无

### `/get`

- 功能说明：获取符合条件事项
- 请求方法：GET
- 请求对象：

```ts
{
    json: Partial<Todo>, // JSON 串
}
```

- 成功响应对象：`Array<Todo>`
- 失败响应消息：无
- 其他说明：
  - 按照 `time` 域从晚到早排序
  - 如果请求对象没有限定条件，返回空数组

### `/getAll`

- 功能说明：获取所有事项
- 请求方法：GET
- 请求对象：

```ts
{
    json: { // JSON 串
        pageNumber?: number,
        pageSize?: number,
    }
}
```

- 成功响应对象：`Array<Todo>`
- 失败响应消息：无
- 其他说明：
  - 获取从 `(pageNumber - 1) * pageSize` 开始的 `pageSize` 条
  - 按照 `time` 域从晚到早排序

### `/set`

- 功能说明：修改事项
- 请求方法：POST
- 请求对象：`Partial<Todo> & Pick<Todo, 'id'>`
- 成功响应对象：无
- 失败响应消息：
  - `id` 不存在：待办事项不存在
- 其他说明：
  - 只修改存在的域

### `/deleteById`

- 功能说明：删除事项
- 请求方法：POST
- 请求对象：

```ts
{
    id: number,
}
```

- 成功响应对象：无
- 失败响应消息：
  - `id` 不存在：待办事项不存在
- 其他说明：无
