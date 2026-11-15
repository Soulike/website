# User 模块

本模块接口的前缀为 `/user`。

---

## 数据库对象

### User

```ts
class User {
  public username: string;
  public password: string;
}
```

---

## 接口信息

### `/add`

- 功能说明：创建新账号
- 请求方法：POST
- 请求对象：`AccountInsertRow`（`username`、`password`）
- 成功响应：`data` 为 `null`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 用户名已存在：`ACCOUNT_ALREADY_EXISTS`
- 其他说明：无

### `/get`

- 功能说明：根据用户名获取账号
- 请求方法：GET
- 请求体：

```ts
{
  json: {
    username: string;
  }
}
```

- 成功响应：`data` 为 `AccountRow` 对象
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 用户名不存在：`ACCOUNT_NOT_FOUND`
- 其他说明：无

### `/modify`

- 功能说明：修改指定账号密码
- 请求方法：POST
- 请求体：`AccountUpdateRow & { username: string }`（至少包含一个可修改字段 `password`）
- 成功响应：`data` 为 `null`
- 失败响应错误码：
  - 请求参数错误：`INVALID_REQUEST_PARAMS`
  - 用户名不存在：`ACCOUNT_NOT_FOUND`
- 其他说明：无
