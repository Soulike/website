# Admin Server

## 简介

本项目是个人网站管理后台的后端。

## 响应对象

响应契约由 `@schema/rpc` 定义：

```ts
type ServerResponse<TData = null> =
  | {isSuccessful: true; data: TData}
  | {
      isSuccessful: false;
      error:
        | {code: Exclude<ErrorCode, 'CATEGORY_IN_USE'>}
        | {code: 'CATEGORY_IN_USE'; details: {articleAmount: number}};
    };
```

- 无返回值的成功响应统一返回 `{ isSuccessful: true, data: null }`
- 当请求参数或 JSON 解析失败时，返回 `{ isSuccessful: false, error: { code: 'INVALID_REQUEST_PARAMS' } }`
- 当未登录或 Session 无效时，返回 `{ isSuccessful: false, error: { code: 'UNAUTHORIZED' } }`
- 当发生未捕获的服务器内部错误时，返回 HTTP 500 `Internal Server Error`

## 模块文档

- [博客模块](document/blog.md)
