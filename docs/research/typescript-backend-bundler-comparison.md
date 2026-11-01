# TypeScript 后端 bundler 比较

- 调研日期：2026-11-01
- esbuild 配置参考：[`bd977bf9707b6ceba8bc10710f3a577744ce20d3`](https://github.com/Soulike/website/commit/bd977bf9707b6ceba8bc10710f3a577744ce20d3)
- 目标：将应用使用的生产 npm 依赖一并打包，最终镜像不携带 `node_modules`；兼顾产物体积、简单配置和可读错误。

**本次选择直接使用 Rolldown，后端构建源码已从 esbuild 迁移。** Rolldown 已发布稳定 1.x，提供内置 TypeScript 转换、Node.js 解析、CommonJS 处理、压缩和名称保留。迁移前的四个 app 对照构建中，它比 esbuild 基线生成的 JavaScript 小 **28%–33%**，JavaScript 加 maps 小 **37%–43%**；临时独立运行目录中的错误和依赖初始化实验也通过。

选择依据是本仓库实测的产物体积收益，以及继续保持简单的 `dist` 交付结构。esbuild 基线也能满足可读错误的要求；本次选择不意味着它存在必须替换的日志缺陷。本文保留比较证据，记录已选实现与可按需采用的后端能力；Node 26 Linux 编译、四个运行阶段 smoke 和真实 auth 错误请求已验证，完整在线多阶段构建与生产部署仍未验证。

## 比较基线与当前实现

比较使用的 [esbuild 基线](https://github.com/Soulike/website/blob/bd977bf9707b6ceba8bc10710f3a577744ce20d3/configs/esbuild/src/server.ts)是 `0.28.2`：`bundle: true`、`platform: 'node'`、ESM、`target: 'node24'`、`minify: true`、`keepNames: true`、linked maps，并通过 banner 提供 `createRequire`。当前实现由 [Rolldown 统一构建配置](../../configs/rolldown/src/server.ts)承接。 同步 `main` 的七天依赖发布延迟后，当前构建选择满足规则的 Rolldown `1.2.15`；以下 `1.2.16` 体积对照保留为初始候选调研证据。四个 Dockerfile 启用 Node.js source maps；auth logger 记录嵌套 cause。此前的[部署调研](typescript-backend-docker-deployment.md)记录了这些交付要求。

迁移前在宿主 Node.js `v26.13.0`、pnpm `12.16.1` 中，将当时的 esbuild helper 和临时安装的 Rolldown `1.2.16` 分别用于同一份源码、同一依赖树。两边都开启压缩、函数与类名称保留、外部 linked maps，并以 Node.js 24 作为语法目标。构建产物和实验代码都放在临时目录，没有新增单元测试。

这里比较的是部署的 JS/maps 文件，未比较 bundler 自身的安装大小，也未测量构建速度、启动性能或 OCI 镜像大小。Vite 或库构建的基准不能直接代替本仓库后端的结果。

## 当前可选工具

以下版本来自调研时的官方 GitHub release，并与 npm registry 的 latest 核对。

| 工具          | 最新发布                                                                        | 对本仓库的实际定位                                  |
| ------------- | ------------------------------------------------------------------------------- | --------------------------------------------------- |
| esbuild       | [0.28.2，2026-08-08](https://github.com/evanw/esbuild/releases/tag/v0.28.2)     | 对照基线；少量配置即可处理 TS、npm、CJS 和压缩      |
| Rolldown      | [1.2.16，2026-10-29](https://github.com/rolldown/rolldown/releases/tag/v1.2.16) | 稳定 1.x；具备完整构建能力，本次产物明显更小        |
| Rollup        | [4.67.4，2026-11-01](https://github.com/rollup/rollup/releases/tag/v4.67.4)     | 可用，但需组合 TS、Node resolve、CommonJS、压缩插件 |
| webpack       | [5.112.2，2026-10-23](https://github.com/webpack/webpack/releases/tag/v5.112.2) | 可用于 Node.js 全量打包；配置和 loader 选择更多     |
| `@vercel/ncc` | [0.45.0，2026-08-13](https://github.com/vercel/ncc/releases/tag/0.45.0)         | 专门封装 Node.js 打包，资源和动态加载处理有针对性   |
| tsdown        | [0.23.4，2026-10-29](https://github.com/rolldown/tsdown/releases/tag/v0.23.4)   | Rolldown 的库构建封装；默认不打包生产依赖           |
| tsup          | [9.0.0，2026-10-14](https://github.com/egoist/tsup/releases/tag/v9.0.0)         | esbuild 的封装；不能作为独立 bundler 的体积优化方案 |

发布记录只能证明版本和活动，不能证明任意应用正确。Rolldown 1.2.16 的 release 仍包含 tree shaking、chunk 和解析修复，应以本仓库的执行结果判断适配性。tsup 虽有近期发布，当前官方 README 仍明确提示项目不再积极维护并推荐 tsdown；不能只凭发布时间覆盖维护者的声明。[tsup README](https://github.com/egoist/tsup)

## Rolldown 的收益与边界

Rolldown 将 TypeScript 转换、模块解析、CJS 互操作和 Oxc 压缩器集成在核心中，采用 Rollup 风格 API；本次不需要额外的 TypeScript、CommonJS 或 node-resolve 插件。[Rolldown：Notable Features](https://rolldown.rs/guide/notable-features)

`platform: 'node'` 必须显式设置：ESM 输出的默认平台是 browser。Node.js 平台会为需要的外部 `require` 生成基于 `module.createRequire` 的实现，可替代当前手写 banner；这保留了外部 `require` 的调用方式，但不会自动把任意动态计算的包名纳入 bundle。[Platform](https://rolldown.rs/reference/InputOptions.platform)、[Bundling CJS](https://rolldown.rs/in-depth/bundling-cjs)

当前 helper 使用 `rolldown()`、`bundle.write()` 和 `finally` 中的 `bundle.close()`，在生成产物失败时也关闭构建资源。官方的一次性 `build()` API 在 1.2.16 仍标为 experimental，本次采用现有稳定 API。当前语法目标更新为 `node26`，根 `engines.node` 为 `>=26`，与选择最新 LTS 的要求对齐；体积表仍是 `node24` 目标下的历史对照，本次没有重做 Node.js 26 目标下的双工具体积比较。配置的完整可执行来源是统一 helper，不在本文维护第二份构建脚本。[Rolldown build API](https://rolldown.rs/reference/Function.build)、[Plugin lifecycle](https://rolldown.rs/reference/Interface.Plugin#closebundle)

PR review 发现 `lts/*` 在实际 CI 中仍解析为 Node 24，因此后续将 [.node-version](../../.node-version) 作为唯一人工维护的主版本来源。`pnpm node:sync` 预先生成 CI、Docker、编译目标和版本声明；`pnpm node:check` 拒绝漂移，运行检查验证 CI、本地构建及后端镜像里的真实 Node。维护步骤与生成范围见 [Node toolchain](../../README.md#node-toolchain)。

这里没有 externalize npm 依赖，Node.js 内置模块继续由运行时提供。`tsconfig: true` 为各模块发现配置并处理 `paths`；扩展名映射支持源码中 `.js` import 对应 `.ts` 文件。当前单入口配置使用 `codeSplitting: false` 输出一个 JS chunk；旧的 `inlineDynamicImports` 选项已弃用。`minify` 默认只是 `dce-only`，不能以默认输出与开启全面压缩的 esbuild 比体积。[TSConfig](https://rolldown.rs/reference/InputOptions.tsconfig)、[Resolve](https://rolldown.rs/reference/InputOptions.resolve)、[Code splitting](https://rolldown.rs/reference/OutputOptions.codeSplitting)、[Minify](https://rolldown.rs/reference/OutputOptions.minify)

`keepNames` 与 source maps 分别保护运行时函数/类名和原始源码位置，Docker 的 `--enable-source-maps` 仍需保留。换 bundler 不改变 logger 必须记录原始错误和 cause 的责任。[Keep names](https://rolldown.rs/reference/OutputOptions.keepNames)、[Sourcemap](https://rolldown.rs/reference/OutputOptions.sourcemap)

还需关注两个实际差异：

- Node.js `exports` 条件和入口选择必须核对。Rolldown 的默认 import/require 条件包含 `node`，esbuild 默认还会启用 `module` 条件；不同选择可能加载不同实现，不能把所有体积差都解释成压缩器更强。[Rolldown resolve](https://rolldown.rs/reference/InputOptions.resolve)、[esbuild conditions](https://esbuild.github.io/api/#conditions)
- 四个 app 都产生 `depd@1.1.2` 直接 `eval` 的警告。本次相关函数调用实验通过，但 direct eval 对作用域合并和改名有特殊要求；没有证据支持忽略该警告或推断所有调用都正确。[Rolldown troubleshooting](https://rolldown.rs/guide/troubleshooting#avoiding-direct-eval)

## 后端能力的采用范围

| 能力                               | 本次处理                                             | 用途和限制                                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 构建诊断 `onLog`                   | 将 `UNRESOLVED_IMPORT` 升为错误，其他诊断继续输出    | 静态 import 的缺包必须阻断构建，避免悄悄留到没有 `node_modules` 的镜像中；不覆盖任意运行时计算的 `require`                                     |
| Node.js `require` polyfill         | 使用内置 `polyfillRequire`                           | ESM 中可保留需要的 Node.js require 行为，减少手写 banner                                                                                       |
| 压缩、名称保留、maps               | 显式开启                                             | 保留小产物、可读函数/类名和原始 TS 位置；日志 cause 仍由 logger 负责                                                                           |
| TS 解析和单个 JS chunk             | 开启 `tsconfig`、扩展名映射和 `codeSplitting: false` | 沿用当前源码与 `dist` 交付约定；动态模块的执行时机仍需按应用验证                                                                               |
| map 路径、源码内容、构建输出元数据 | 需要时再配置                                         | `sourcemapPathTransform` 可规范源码路径；排除 `sourcesContent` 可减小 maps；chunk 元数据可辅助体积与外部 import 分析，不能独自证明动态依赖闭包 |
| `new URL` 资源处理                 | 暂不启用 experimental 选项                           | 资源复制与 URL 重写可用于实际资源需求；引用的 JS/TS 文件只会原样复制，不会编译 TS 或打包其依赖，worker 入口需要另行构建                        |

`onLog` 的默认 handler 支持把诊断升级为抛出的错误，旧的 `onwarn` 已弃用。本次没有静默日志级别或插件过滤，不会主动吞掉已发现的 EVAL 警告。[onLog](https://rolldown.rs/reference/InputOptions.onLog)

当前保留默认 tree shaking，不声明所有模块无副作用，也不把日志函数标为 pure。`moduleSideEffects: false` 或自定义 pure 函数名单会允许删除原本执行初始化、注册或输出日志的代码，只有具体行为已验证时才适合使用。[Tree-shaking options](https://rolldown.rs/reference/TypeAlias.TreeshakingOptions)

maps 的路径变换和源码内容选择服务于诊断与产物管理；`sourcemapIgnoreList` 是供消费者使用的忽略元数据，不能据此承诺 Docker 的 Node.js 日志会隐藏依赖堆栈。资源 URL 处理属于 experimental，尤其不能把原样复制的 TS worker 当作已编译的独立后端程序。[Sourcemap paths](https://rolldown.rs/reference/OutputOptions.sourcemapPathTransform)、[Asset URL option](https://rolldown.rs/reference/InputOptions.experimental#resolvenewurltoasset)

## 本仓库实测

下表使用十进制 MB，记录 JS 已 minify、文件未经过 gzip 等文件压缩时的大小；两边 maps 均保留 `sourcesContent`。

| App               | esbuild JS | Rolldown JS | JS 减少 | esbuild JS + map | Rolldown JS + map | 合计减少 |
| ----------------- | ---------- | ----------- | ------- | ---------------- | ----------------- | -------- |
| `auth`            | 1.846 MB   | 1.285 MB    | 30.4%   | 6.929 MB         | 4.130 MB          | 40.4%    |
| `admin-legacy`    | 1.954 MB   | 1.405 MB    | 28.1%   | 7.483 MB         | 4.684 MB          | 37.4%    |
| `blog-legacy`     | 1.706 MB   | 1.143 MB    | 33.0%   | 6.326 MB         | 3.588 MB          | 43.3%    |
| `database-legacy` | 1.773 MB   | 1.204 MB    | 32.1%   | 6.537 MB         | 3.779 MB          | 42.2%    |

四个 app 两边都构建成功。Rolldown 各输出一个 `.mjs` 和 map；chunk 的静态 imports 只有 Node.js 内置模块，`dynamicImports` 为空。Rolldown maps 的 source 数量也更少，可能与入选文件、保留代码、map 生成与重映射方式或虚拟 source 有关，本次未分解这些影响；输出大小和静态 import 列表不能独自证明所有动态依赖都已覆盖。

另一个最小运行实验将两边输出分别复制到没有 `node_modules` 的独立目录，验证了：

- Koa、router、bodyparser、cors 和 session 的实例或中间件构造。
- ioredis 的 `lazyConnect` 构造及 disconnect、pg Pool 构造及 end，没有连接数据库或 Redis。
- `depd@1.1.2` 的直接 eval 包装函数调用，以及 CJS `require(variable)` 加载 `node:path`。
- 动态 import 的实验执行顺序为 `entry` 后 `loaded`。
- 实际 `Logger.dispatcherError` 输出原始 TypeError、嵌套 cause、`BackendDependency.query` 和 logger 的可读堆栈名称；函数和类的运行时 `name` 保留。

两边实验均通过，maps 均指回原始 TS 文件和行。映射列存在小差异：同一 throw 表达式，esbuild 指向 `new` 的第 11 列，Rolldown 指向 `TypeError` 的第 15 列；不能承诺逐字符一致。`depd` 自己定制的堆栈输出在两边仍指向 bundle，名称保留和 Node.js maps 不保证第三方自定义 formatter 都还原位置。

对照构建和最小实验没有执行 image smoke，也未运行四个真实服务的 HTTP、数据库或 Redis 路径；原生扩展、包内资源和目标 Linux 平台行为未验证。上述最小实验属于选定行为的证据，不能替代这些验证。

## 迁移实现后的验证

- `@config/rolldown` 与四个 app 的 build 引用已迁移；新配置的 typecheck、ESLint，以及四个实际 app 的 pnpm 构建通过。当前 app 构建采用 `node26` 语法目标。
- 同步 `main` 的 TypeScript 6、Vitest 和七天发布延迟后，使用 Rolldown `1.2.15`、`node26` 目标重新通过 `pnpm install --frozen-lockfile --offline`、完整 `pnpm validate:pr` 和 `pnpm test`。
- 调用实际新 helper 构建的独立运行 fixture 通过，保留可读名称、TS maps、cause 和选定 Koa / Redis / PostgreSQL 依赖初始化行为。
- 缺少静态包 import 的实验以 `UNRESOLVED_IMPORT` 和非零退出码失败，验证了构建失败门槛。Rolldown 在拒绝前可能写出部分 `dist`；消费者必须以构建命令是否成功判断结果，不能以输出目录存在作为成功证据。
- 在 Node.js `26.13.0`、Linux amd64、Alpine 容器中，为现有 workspace 依赖提供对应版本的 musl binding，四个 app 均使用实际新 helper 编译成功；候选 `1.2.16` 和最终选择的 `1.2.15` 都经过验证，没有在该容器中重新执行完整 workspace 安装。
- 将上述 Linux 编译产物按各 Dockerfile 最终阶段的目录、用户创建命令、WORKDIR、USER、EXPOSE 和 CMD 组装到同一个 Node 26 Alpine 基础镜像，四个现有 image smoke 均通过。运行镜像只带应用 `dist`，没有应用 `node_modules`。
- 独立 auth 容器中，对未建表的测试 PostgreSQL 发出真实 `POST /session` 请求，得到 HTTP 500；日志保留了原始 `relation "users" does not exist`、`42P01`、嵌套 cause、`Logger.dispatcherError` 和 TS 文件行列。
- 选择 `1.2.15` 后重新完成上述四个运行阶段 smoke、真实 auth 错误日志检查，以及缺包失败和独立 names/maps/cause fixture 检查。
- 完整 Dockerfile 的在线多阶段构建在镜像解析/拉取阶段长时间等待后中止。本次未验证完整 builder 的重新安装流程，也未部署生产；上述检查支持 Linux 编译及最终运行阶段。
- 统一版本来源后，八项生成与运行策略测试、真实 Node 24 拒绝检查、CI 配置漂移检查、全仓验证和测试均通过；正式 `node:26-alpine` 镜像确认运行 Node `26.13.0`，四个后端 Linux 编译及包含镜像版本验证的 smoke 通过。

## 其他工具为什么没有优先于 Rolldown

**Rollup** 可以实现相同目标，但需要 Node resolve、CommonJS、TypeScript 和压缩插件。CommonJS 插件有 `strictRequires`、`requireNodeBuiltins` 和 `dynamicRequireTargets` 等选项，适合需要细致控制这些语义的情况；本仓库尚未发现需要以更多插件维护换取的独有收益。[Node resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)、[CommonJS](https://github.com/rollup/plugins/tree/master/packages/commonjs)、[TypeScript](https://github.com/rollup/plugins/tree/master/packages/typescript)

**webpack** 的 Node.js target 和内置模块处理可支持全量 npm 打包。ESM 输出在 5.111.0 已稳定，当前应使用 `output.module: true`，无需旧的 `experiments.outputModule`。它提供更多 loader、资源、压缩与代码拆分配置，但本次没有测出它对这四个 app 的体积或运行优势；不能因为功能更多就推断更符合简单交付目标。[Webpack 5.111](https://webpack.js.org/blog/2026-09-14-webpack-5-111/)、[Externals](https://webpack.js.org/configuration/externals/)

**ncc** 是更专门的 Node.js 打包封装：内置 TypeScript，处理静态可分析的资源和动态加载，并返回代码、map 和可能附带的 assets。遇到需要读取包内文件、worker 或 `.node` 文件的依赖时，它比通用 bundler 更值得专项比较；无法静态分析的资源仍可能需要额外处理。[ncc README](https://github.com/vercel/ncc)

ncc 0.45.0 的实现开启名称保留，但其压缩使用 Terser `compress: false`；source maps 使用 `cheap-module-source-map`，保留原始行而不保留列。它默认的 source-map 注册代码也有额外体积，在当前 Node.js 原生 maps 环境可以评估关闭。这些事实支持进一步测试具体资产场景，不能据此宣称 ncc 的产物更小或错误信息更完整；本次未构建 ncc 产物。[ncc 0.45.0 source](https://github.com/vercel/ncc/blob/0.45.0/src/index.js)、[Webpack devtool](https://webpack.js.org/configuration/devtool/)

**tsdown / tsup** 是构建流程封装。tsdown 的核心是 Rolldown，tsup 的核心是 esbuild，增加一层封装本身不能证明 JS 更小。tsdown 的默认行为会 externalize `dependencies`、`peerDependencies` 和 `optionalDependencies`，需要额外覆盖依赖规则才符合本次目标；本仓库已有简短的统一 build helper，没有采用库发布、声明文件或多格式封装的需要。[tsdown：Rolldown options](https://tsdown.dev/advanced/rolldown-options)、[Dependencies](https://tsdown.dev/options/dependencies)、[tsup README](https://github.com/egoist/tsup)

本次源代码已选择直接 Rolldown API，并保留相同交付结构；Node 26 Linux 编译、最终阶段 smoke 和真实请求错误日志检查已完成，完整在线多阶段构建与生产部署仍是后续验证边界。出现具体资源或原生依赖的打包问题时，再比较 ncc；当前没有支持改用 webpack、Rollup 或增加封装层的本仓库证据。
