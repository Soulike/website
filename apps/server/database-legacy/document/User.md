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

- 功能说明：创建新用户
- 请求方法：POST
- 请求对象：一个 [User](#user) 对象
- 成功响应对象：无
- 失败响应消息：
  - 用户名已存在：用户名已存在，请修改用户名
- 其他说明：无

### `/get`

- 功能说明：根据用户名获取用户
- 请求方法：GET
- 请求体：

```ts
{
  json: {
    username: string;
  }
}
```

- 成功响应对象：[User](#user) 实例
- 失败响应消息：
  - 用户名不存在：用户不存在
- 其他说明：无

### `/modify`

- 功能说明：修改指定用户的指定信息
- 请求方法：POST
- 请求体：一个 `Partial<User> & Pick<User, 'username'>` 实例
- 成功响应对象：无
- 响应代码及语义：
  - 用户名不存在：用户不存在，修改失败
- 其他说明：无
