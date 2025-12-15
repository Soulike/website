# 数据库服务器

## 简介

数据库管理后端服务器，基于 Koa 与 TypeScript。

本项目是本人个人网站项目的一部分，使用 ORM 封装数据库并对外提供 HTTP 服务。

## 接口文档

所有接口见 [API 文档](Api.md)。

## 部署方法

### 1. 安装环境依赖

本项目的正常运行依赖于以下组件，请查询具体操作系统的安装方法。

#### 运行时依赖

- Node.js
- npm
- (非必须) pm2

Node.js 安装方法参照官方文档，npm 一般随 Node.js 安装。

要安装 pm2，在有 npm 的前提下，运行 `sudo npm i -g pm2` 即可。

pm2 主要用于进程管理，如果使用其他进程管理工具，可以不安装。

### 2. 安装项目依赖

在项目目录下，执行 `npm install`，等待项目依赖安装完成。

### 3. 配置

所有配置文件均在 `src/CONFIG` 下，文件内容如下：

- `DATABASE.ts` 数据库配置，**在启动服务器前务必根据实际情况配置，配置项见文件内容**
- `SERVER.ts` 服务器配置，**在启动服务器前务必根据需要配置，配置项见文件内容**

### 4. 编译

在项目目录下，执行 `npm run build`，等待项目编译完成。

### 5. 运行

在项目目录下，执行 `pm2 start --name "Database" dist/index.js -i max` 即可。

`Database` 是本服务器在 pm2 进程列表中的名字，可以自由更换。

如果不使用 pm2 进行进程管理，可以在项目目录下执行 `npm run start`。

## 测试

```bash
npm test
```

## 调试用命令

- `npm run watch` 启用 TypeScript 监视源文件编译模式，在 `.ts` 源文件改变时自动编译
- `npm run start-dev` 使用 `nodemon` 启动服务器，在 `.js` 源文件改变时自动重启服务器
