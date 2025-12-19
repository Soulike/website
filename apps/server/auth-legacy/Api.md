# 接口文档

## 各个请求的详细信息

### User 模块

#### `/login`

- 功能说明：用户登录并下发 Session
- 请求方法：POST
- 请求对象：

```ts
{
    username: string,       // 用户名
    password: string,       // 密码
}
```

- 成功响应对象：无
- 失败响应消息：
  - 密码错误：密码错误
- 其他说明
  - 在登录成功后下发 Session

#### `/logout`

- 功能说明：退出登录，销毁用户当前 Session
- 请求方法：POST
- 请求对象：无
- 成功响应对象：无
- 失败响应消息：无
- 其他说明：无

#### `/checkSession`

- 功能说明：检查当前请求 Session 是否有效
- 请求方法：GET
- 请求体：无
- 成功响应对象：

```ts
{
    isInSession: boolean,
}
```

- 失败响应消息：无
- 其他说明：无
