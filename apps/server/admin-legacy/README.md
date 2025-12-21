# Admin Server

## 简介

本项目是个人网站管理后台的后端。

## 响应对象

```ts
class Response {
  public isSuccessful: boolean; // 本次请求是否成功
  public message?: string; // 请求失败时，显示给用户的消息
  public data?: any; // 请求成功时，前端需要的数据
}
```

- 当因服务器发生错误无法产生响应时，消息填写“服务器错误”
- 当请求参数错误时，消息填写“请求参数错误”

## 模块文档

- [博客模块](document/blog.md)
