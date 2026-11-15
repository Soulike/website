# 接口文档

## 设计原则

### 禁止过度包装

所有接口的返回值严格对应功能。如果请求需要数字就返回数字，需要数组就返回数组，需要对象就返回对象，必要时返回 `null`，不要做二次包装。

### 强通用性

接口设计应当考虑复用性，因此功能设计不要过于特化。

---

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
- 当请求参数不符合接口契约或 JSON 解析失败时，返回 `{ isSuccessful: false, error: { code: 'INVALID_REQUEST_PARAMS' } }`（服务端记录 Zod 校验详情，不向客户端暴露内部 details）
- 当发生未捕获的服务器内部错误时，返回 HTTP 500 `Internal Server Error`

---

## 接口详细信息

- 所有接口入口均使用 Zod（`@schema/database`、`@schema/blog` 及端点局部 Schema）进行严格参数校验：
  - `/get`、`/count` 等筛选接口仅接受白名单字段且至少需提供一个筛选字段，空筛选对象或未知字段将被拒绝（`INVALID_REQUEST_PARAMS`）
  - `/modify` 接口必须包含主标识符及至少一个可修改字段，空更新将被拒绝（`INVALID_REQUEST_PARAMS`）

所有接口文档见 [document](./document) 文件夹。
