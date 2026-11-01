# TypeScript 后端 Docker 部署方式调研

- 调研日期：2026-11-01
- 初始调研基线：[`3cce0b86635cde06130950b5470968c602dcfd02`](https://github.com/Soulike/website/commit/3cce0b86635cde06130950b5470968c602dcfd02)
- 本地验证环境：Node.js `v26.13.0`、pnpm `12.16.1`、esbuild `0.28.2`。

**本次先修复 source maps、函数和类名保留及 auth 的错误因果链，随后选择迁移到 Rolldown。** 四个 Dockerfile 已在启动命令中加入 `--enable-source-maps`；auth 的请求错误和未捕获错误日志改为用 `util.inspect(..., {depth: null})` 输出错误及嵌套 `cause`。构建使用 `minify: true` 和 `keepNames: true`，以保留可读的报错名称。

逐文件 JS + `pnpm deploy --prod` 是可行的另一种部署方式，但本次没有选择迁移。维护者反馈此前携带 `node_modules` 的镜像过大，优先保留 bundle 的体积和交付复杂度优势；本次没有测量两种方案的 OCI 镜像大小。本文保留初始调研基线和备选方案；当前构建工具、采用的特性和迁移验证见 [bundler 比较记录](typescript-backend-bundler-comparison.md)。

## 交付结构与初始 esbuild 基线

| App               | Docker 最终阶段          | 监听端口 | 当前运行命令                               |
| ----------------- | ------------------------ | -------- | ------------------------------------------ |
| `auth`            | `auth-server`            | 3000     | `node --enable-source-maps dist/index.mjs` |
| `admin-legacy`    | `admin-server-legacy`    | 4003     | `node --enable-source-maps dist/index.mjs` |
| `blog-legacy`     | `blog-server-legacy`     | 4004     | `node --enable-source-maps dist/index.mjs` |
| `database-legacy` | `database-server-legacy` | 4000     | `node --enable-source-maps dist/index.mjs` |

四个 [Dockerfile](../../apps/server/auth/Dockerfile) 使用相同结构：在由 [`.node-version`](../../.node-version) 生成的 `node:26-alpine` 中复制仓库、安装完整 pnpm workspace、构建目标 app；最终阶段复制整个 `dist`，以非 root 用户执行 Node.js。最终镜像没有复制 `node_modules`。目前各 app 的 `build.ts` 调用统一的 [Rolldown 配置](../../configs/rolldown/src/server.ts)，语法目标为 Node.js 26。以下是迁移前的 [esbuild 配置](https://github.com/Soulike/website/blob/bd977bf9707b6ceba8bc10710f3a577744ce20d3/configs/esbuild/src/server.ts)，保留为初始调研证据：

```ts
bundle: true,
platform: 'node',
format: 'esm',
target: 'node24',
minify: true,
keepNames: true,
sourcemap: 'linked',
outExtension: {'.js': '.mjs'},
```

初始 esbuild 配置还用 `createRequire(import.meta.url)` 为打包的 CommonJS 依赖提供动态 `require`。`linked` 会生成旁边的 `.map` 和 `sourceMappingURL` 注释；Docker 复制整个 `dist` 时也复制 `.map`。[esbuild：Sourcemap](https://esbuild.github.io/api/#sourcemap)

初始调研基线的 [CI](../../.github/workflows/apps-ci.yml) 使用 `lts/*`，Docker 使用 `node:lts-alpine`；当前由 [Node toolchain](../../README.md#node-toolchain) 从 `.node-version` 生成明确的 CI major `26` 和 `node:26-alpine` 标签。[镜像工作流](../../.github/workflows/docker-image-build-and-push.yml) 构建 `linux/amd64`，先运行 smoke，再按需发布 `latest`。Node.js 官方页面在调研时列出 Node.js 26 为最新 LTS，Node.js 24、22 也处于 LTS；本次运行时行为采用 [Node.js 26 文档](https://nodejs.org/docs/latest-v26.x/api/)。迁移前 esbuild 的 `target: 'node24'` 是输出语法兼容目标，不能证明实际容器运行的是 Node.js 24。[Node.js release status](https://nodejs.org/en/about/previous-releases)

## 错误日志的信息在哪里丢失

需要分别处理三个问题：

1. **文件、行和列**：修复前启动命令未启用 source maps，堆栈指向 bundle。新增的 `--enable-source-maps` 会尽力还原到原始文件位置；这同样适用于逐文件编译，不只是 bundle。[Node.js：`--enable-source-maps`](https://nodejs.org/docs/latest-v26.x/api/cli.html#--enable-source-maps)
2. **函数和类名**：`minify: true` 会改名；即使不压缩，bundle 也可能因名称冲突而改名。`keepNames: true` 保留函数、类的运行时 `name`，与位置映射承担不同职责。[esbuild：Keep names](https://esbuild.github.io/api/#keep-names)
3. **原始错误及因果链**：修复前 [`Logger.dispatcherError`](../../libraries/server/logger/src/index.ts) 创建 `new Error(..., {cause: error})`，却只输出新错误的 `.stack`，丢失了原始 `cause`。现在输出整个包装错误的 `util.inspect()` 结果；auth 未捕获错误日志也采用相同的检查方式。`depth: null` 允许递归显示嵌套 cause，循环引用可以表示为引用标记。[Node.js：`error.cause`](https://nodejs.org/docs/latest-v26.x/api/errors.html#errorcause)、[util.inspect](https://nodejs.org/docs/latest-v26.x/api/util.html#utilinspectobject-options)

因此，更换 Docker 打包方式只能解决其中一部分。必须保留原始错误的 message、stack 和 cause，再决定日志格式。

## 方案比较

| 方案                               | 错误定位                                | 依赖处理                              | 本仓库改造成本                     | 适用判断                                 |
| ---------------------------------- | --------------------------------------- | ------------------------------------- | ---------------------------------- | ---------------------------------------- |
| 全量 esbuild bundle + source maps  | 可以还原原始文件行列；名称单独处理      | 最终阶段继续只复制 `dist`             | 低                                 | 初始选择，后续替换为 Rolldown            |
| 逐文件 JS + `pnpm deploy --prod`   | 保留文件结构；source maps 可指回 TS     | pnpm 生成独立生产依赖目录             | 中到高：需建设 workspace JS 产物   | 本次未选，保留依赖目录带来的体积成本     |
| 内部代码 bundle，npm 依赖 external | 内部靠 maps，依赖保留原有文件           | 仍需部署生产 `node_modules`           | 中：需明确 external 边界和部署清单 | 内部 TS 暂时不拆包、外部依赖不适合打包时 |
| 原生 Node.js 执行 TS / `tsx`       | 原生擦除类型保留行号；loader 路径需验证 | 仍需生产依赖，`tsx` 还需运行时 loader | 当前原生 Node.js 路径存在阻断      | 暂不建议作为本次部署迁移方向             |

### 1. 保留 bundle，补齐可观测性

本次修复范围是：

- 保留 `sourcemap: 'linked'` 和整个 `dist` 的复制。
- 四个 app 的启动命令使用 `node --enable-source-maps dist/index.mjs`。
- 保留 `minify: true`，启用 `keepNames: true`。source maps 负责位置映射，并可能还原部分堆栈名称；它不改变函数或类的运行时 `name`。本次要求报错时保留可读的函数和类名，因此显式启用 `keepNames`，无需关闭压缩。
- logger 输出原始错误及嵌套 `cause`；真实请求失败的容器日志仍需部署验证。

source maps 的位置映射不要求部署原始 `.ts` 文件。`sourcesContent: false` 可以缩小 `.map`，但调试器要查看源码时需要另行取得与构建匹配的源文件；保留当前嵌入源码的 maps 也有效。[esbuild：Sources content](https://esbuild.github.io/api/#sources-content)

启用 maps 会增加访问 `Error.stack` 时的成本；自定义 `Error.prepareStackTrace` 也可能干扰映射。因此不能宣称日志内容完全不受运行环境影响，性能需要按实际错误量衡量。[Node.js CLI](https://nodejs.org/docs/latest-v26.x/api/cli.html#--enable-source-maps)

这条路径保留目前简单的镜像交付方式。其边界是：并非所有 npm 包都适合 bundle。读取包内资源、依赖 `__dirname` / `import.meta.url`、加载 `.node` 原生扩展等行为需要逐个确认；本次没有发现并证明现有四个 app 存在这类生产失败。[esbuild：Packages](https://esbuild.github.io/api/#packages)

### 2. 逐文件编译 JS，再用 pnpm deploy

`pnpm deploy` 会复制目标项目，并在目标目录安装隔离的 `node_modules`，包含所需 workspace dependencies；产物可以脱离原 workspace 复制运行。使用 `--prod` 排除开发依赖。[pnpm deploy](https://pnpm.io/cli/deploy)

**当前 pnpm 12.16.1 不要求先开启 `injectWorkspacePackages`。** 官方文档说明，从 12.2.0 起 deploy 支持普通链接的 workspace dependencies；旧版本的统一限制已经改变。复杂 peer 绑定仍可能因歧义报 `ERR_PNPM_DEPLOY_AMBIGUOUS_PEER`，应按具体依赖图处理，不能先假定成功。[pnpm deploy：版本行为](https://pnpm.io/cli/deploy)

本仓库采用这条路径前有四个具体前提：

1. 对目标 app 及其运行时依赖闭包建立逐文件 JS 编译。相关 packages 当前只有 typecheck/test，没有 JS build；例如 [`@library/logger`](../../libraries/server/logger/package.json)、[`@module/database`](../../modules/server/database/package.json) 的 `main` / `exports` 指向 `src/*.ts`。deploy 负责打包依赖，不负责把 TS 编译为 JS。
2. 将这些 packages 的运行时入口指向 `dist/*.js`，保证 app 在部署目录解析到 JS；同时处理 app 的 `@/*` 别名。`tsc` 不会改写 `paths` 对应的 emitted import，单纯换成 `tsc` 仍会留下 Node.js 无法解析的别名。[TypeScript：Paths](https://www.typescriptlang.org/tsconfig/paths.html)
3. 明确每个运行时 package 的部署文件，例如通过 `files` 纳入 `dist`、maps 和所需资源。deploy 默认遵循 `pack` 的文件选择规则，不能仅凭本地有 `dist` 就认为输出会包含它。[pnpm deploy：Files included](https://pnpm.io/cli/deploy#files-included-in-the-deployed-project)
4. 在 Linux builder 中完成依赖安装和 deploy，最终阶段只复制部署目录，以 Node.js 直接执行入口，并继续启用 maps。

完成这些前提后，部署步骤可以是：

```sh
pnpm --filter auth deploy --prod /prod/auth
```

这是一条**依赖部署命令**，不是当前仓库已经具备的完整编译流程。编译可以用 `tsc` 或 esbuild 的逐文件转换，但需要覆盖运行时文件和静态资源，不能只编译一个入口却禁止 bundle。

如果主动使用 injected dependencies，构建后新增、删除的文件不会自动进入既有硬链接集合；`syncInjectedDepsAfterScripts: [build]` 用于在构建脚本后同步。pnpm 的 [Docker 示例](https://pnpm.io/docker#example-2-build-multiple-docker-images-in-a-monorepo)采用了此配置，但它是该示例的选择。`--legacy` / `forceLegacyDeploy` 选择旧部署实现，本次没有采用它们的必要证据。[pnpm：Workspace settings](https://pnpm.io/workspaces#syncinjecteddepsafterscripts)、[deploy：Legacy](https://pnpm.io/cli/deploy#--legacy)

### 3. 内部 bundle，外部依赖保持 Node.js 包结构

这条折中路径可继续让 esbuild 解析内部 TS 和别名，同时避免把外部 npm 包塞进 bundle。运行时复制业务 bundle、maps 和生产依赖目录。

但 `packages: 'external'` 会把所有包形式的 import 都标为 external，包括本仓库的 `@library/*`、`@module/*`；它不会自动识别“内部包可以打包、第三方包不能打包”。若要这个边界，需要显式 external 清单或解析规则，并检查传递依赖。[esbuild：Packages](https://esbuild.github.io/api/#packages)

同时，`pnpm deploy` 按声明的依赖图部署；已经被 bundle 吸收的 workspace packages 仍可能进入部署目录。是否保留这部分文件，或建设只声明外部运行依赖的部署 manifest，是额外维护选择。因此当前仅为补齐日志信息采用混合方案，收益不足以抵消它增加的边界管理。

### 4. 直接运行 TypeScript

Node.js 原生类型擦除用空白替换类型，不需 maps 就能保留源文件行号，但不读取 `tsconfig`，不解析 `paths`，要求导入实际存在的 `.ts` 文件，且拒绝处理 `node_modules` 下的 TS。Node.js 26 还移除了旧的 `--experimental-transform-types`；enum、参数属性和有运行时内容的 namespace 不在原生擦除能力内。[Node.js 26：TypeScript](https://nodejs.org/docs/latest-v26.x/api/typescript.html)

本仓库当前使用 `@/*` 别名、指向 `.ts` 的 workspace 入口和 `.js` 相对 import。这些约定适合构建工具，不能据此认为生产环境可直接执行原始 TS；下面的 deploy 实验也确认了 `node_modules` 限制。

Node.js 官方展示了 `node --import=tsx your-file.ts` 作为第三方 loader 的使用方式。若选择这条生产路径，`tsx` 必须随运行依赖部署，类型检查仍需独立完成，还要验证每个 workspace package 的解析、loader 行为和错误输出。本次未执行 `tsx` 的生产部署实验，不能把它列为已验证替代品。[Node.js：Full TypeScript support](https://nodejs.org/docs/latest-v26.x/api/typescript.html#full-typescript-support)

## Docker 构建上的共同要求

采用哪种代码产物，都可继续多阶段构建，把编译器和开发依赖留在 builder。当前 `COPY . .` 在安装依赖之前，源码变化会改变该层的输入；需要优化时，可按 pnpm 官方方案先复制锁文件及 `pnpm-workspace.yaml`、执行 `pnpm fetch`，复制源码后离线安装，或使用合适的 BuildKit store cache。[pnpm：Docker](https://pnpm.io/docker#example-3-build-on-cicd)、[Docker：Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)

若开始复制生产 `node_modules`，依赖必须为目标 Linux、架构和 C 库安装。当前 CI 目标是 `linux/amd64`，不能复制 macOS 本地依赖。Alpine 使用 musl，Debian 使用 glibc；有原生依赖时应让 builder 与 runtime 的平台和 ABI 兼容。`node:lts-slim` 是可选的 Debian 运行环境，不是修复堆栈的必要条件。[Node.js Docker：Image variants](https://github.com/nodejs/docker-node#image-variants)

初始基线使用滚动 `lts` 标签时，应记录构建和 smoke 实际使用的 Node.js/pnpm 版本及镜像信息。Node.js 官方确认 `lts` 标签选择 Active LTS，但本次没有解析当时的 registry manifest，不能由标签文字推断某个已发布镜像的版本。当前策略由 [Node toolchain](../../README.md#node-toolchain) 固定 major，允许该 major 内的 patch release 正常更新。[Node.js Docker：LTS](https://github.com/nodejs/docker-node#long-term-support-lts)

## 调研基线验证

所有应用构建和实验产物均放在临时目录，未写入应用的 `dist`，未新增单元测试。堆栈实验使用最小 TS 调用链，由当前统一配置打包，并调用打包后的实际 `Logger.dispatcherError`；应用构建与这项堆栈实验分别验证。

| 验证                                                                  | 结果                                                                                               | 能支持的结论                                                |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 使用当前统一配置构建四个 app                                          | 全部成功；四份 map 都包含完整 `sourcesContent`                                                     | 当前构建能够生成带 maps 的 bundle                           |
| 修复前压缩 bundle、不启用 maps                                        | 函数名为 `be`；堆栈指向 `dist/index.mjs:9:1997`                                                    | 修复前命令下可重现 bundle 位置和改名                        |
| 同一 bundle，仅添加 `--enable-source-maps`                            | 原始堆栈还原为 `readDatabaseResponse (...src/request-handler.ts:2:9)`；运行时函数 `name` 仍为 `be` | 位置映射有效；运行时名称需要单独保护                        |
| 不压缩 + maps；压缩 + `keepNames` + maps                              | 两种都保留实验函数名与 `Logger.dispatcherError` 名称                                               | 两条名称处理路径在实验中有效                                |
| 调用修复前的实际 `Logger.dispatcherError`                             | 所有构建变体都未输出原始错误 message 和 throw stack                                                | 日志的 `cause` 丢失独立于 bundle 和 maps                    |
| `pnpm --filter auth deploy --prod --offline`，保持当前 workspace 设置 | 成功，部署 140 个包；app 的开发依赖被排除                                                          | pnpm 12.16.1 能生成当前 auth 的生产依赖闭包，无需 injection |
| 部署目录中的依赖解析                                                  | `node_modules` 的全部软链接都留在部署根目录内；导入 `koa` 成功                                     | 部署目录不依赖原 workspace 的链接，普通 JS 依赖可以加载     |
| 从上述部署目录用原生 Node.js 导入 `@library/logger`                   | 失败：`ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`，指向部署目录中的 `src/index.ts`               | deploy 成功不代表当前 TS workspace packages 可直接运行      |

初始 esbuild 压缩 bundle 约为 1.66–1.90 MB，旁边的 maps 约为 4.58–5.48 MB，记录的是尚未经过 gzip 等文件压缩的大小。它们不能推导 OCI 镜像大小、启动时间或生产错误日志的性能。

初始诊断修复阶段 Docker daemon 不可用，未构建或运行容器，也未验证生产请求、目标平台原生依赖或 `tsx`。下列记录保留该阶段的验证范围；后续 Rolldown 与 Node 26 的 Linux 编译、容器 smoke 和真实错误请求验证见 [bundler 比较记录](typescript-backend-bundler-comparison.md#迁移实现后的验证)。

## esbuild 诊断修复阶段验证

- 从四个 Dockerfile 读取实际启动命令，在宿主 Node.js 中执行同一个压缩的临时 fixture；运行目录只复制 `dist` 和 maps。四条命令都输出了原始 `request-handler.ts:2:9` 位置，运行目录没有源文件。
- fixture 调用修复后的实际 `Logger.dispatcherError`，验证请求方法和路径、三层错误消息、原始 TypeError 堆栈，以及字符串和循环引用错误值均进入日志。未通过模拟 HTTP 请求验证 auth 的完整请求链路。
- auth 应用重新打包成功，保留压缩和 linked maps；auth 与 logger 的 typecheck、ESLint 检查通过，auth 现有测试 3 项通过。没有新增单元测试。
- 开启 `keepNames` 后，使用实际构建配置与未压缩 bundle 对比：实验中的普通函数名、类名、`Logger.dispatcherError` / `BackendDependency.query` 堆栈名称和原始 `request-handler.ts:3:11` 位置均保留，嵌套 cause 仍可见。四个 app 使用更新后的统一配置重新打包成功，配置包的 typecheck 与 ESLint 通过。
- 该阶段 Docker daemon 不可用，尚未验证容器 smoke 和生产日志；后续验证单独记录在上述 bundler 比较文档中。
