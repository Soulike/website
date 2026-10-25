# 将 `Soulike/ai-review-workflow` 接入 `Soulike/website` 的 blocker 调研

- 调研日期：2026-10-25
- 本仓库基线：[`a02d56da9307900d1322b0863a4a3a18c2317969`](https://github.com/Soulike/website/commit/a02d56da9307900d1322b0863a4a3a18c2317969)（`main`）
- 上游基线：[`4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5`](https://github.com/Soulike/ai-review-workflow/commit/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5)（`main`，2026-10-18）

本文核对共享工作流、GitHub 平台契约，以及本仓库的 Actions、secret、policy、ruleset 和 workflow 状态，并记录 2026-10-25 同日完成的接入配置。secret 检查只读取名称，不读取或保存值。

## 本仓库结论

**可以接入，没有架构性或代码库层面的 blocker。** 初始评估发现的两个配置 blocker 已解除：repository secret `TAVILY_API_KEY` 已存在；Actions event policy `#8840` 已 active，只覆盖 `.github/workflows/ai-review.yml` 并只允许 `pull_request_target`。

Repository variables 已设置为 `AI_REVIEW_MODEL=gpt-6.1-sol` 和 `AI_REVIEW_REASONING_EFFORT=xhigh`。原生 Copilot auto-review 已关闭，caller 已加入当前分支且不配置仓库专属 prompt。

剩余必须由首次托管运行确认的条件是：**Actions `GITHUB_TOKEN` 是否能在本仓库实际使用 Copilot CLI，以及所选模型和 reasoning effort 是否按声明执行。** 当前上游 SHA 已在另一个 consumer 使用 `gpt-6.1-sol` 成功完成 review，但本仓库自己的 post-deployment run 才是 entitlement、模型解析、评论发布和 gate 的充分证据。

## 本仓库配置对照

| 检查项 | 当前证据 | 判断 |
| --- | --- | --- |
| 仓库与可见性 | `Soulike/website`，public，个人账号所有，默认分支 `main` | 兼容。public caller 可以调用 public reusable workflow |
| Actions 总开关与 allowlist | Actions enabled；`allowed_actions: all`；`sha_pinning_required: false` | 兼容。没有 allowlist 或 SHA-only policy 阻止 `Soulike/ai-review-workflow@main` 及其 nested actions |
| 默认 token 权限 | `default_workflow_permissions: read`；caller 可声明 job-level permissions | 兼容。按上游示例显式授予完整 job permissions 即可 |
| Actions PR approval | `can_approve_pull_request_reviews: false` | 兼容。共享 workflow 发布的是 `COMMENT` review，不依赖 GitHub approval |
| 必需 secret | `TAVILY_API_KEY` repository secret 已存在 | 已解除 |
| `pull_request_target` policy | Policy `#8840` active，只覆盖 `.github/workflows/ai-review.yml` 并允许 `pull_request_target` | 已解除 |
| 外部 reusable workflow | 仓库允许所有 actions/workflows；上游为 public | 兼容 |
| Caller 文件 | 当前分支新增 `.github/workflows/ai-review.yml` | 已按上游公开契约配置 |
| 当前 branch protection | `main` 只要求 GitHub Actions 的 `ci-success`；strict；要求解决对话；0 个 approval | 兼容。先部署并验证，再增加 AI gate，不会形成初始化死锁 |
| 原生 Copilot review | Auto-review ruleset 已关闭 | 不会与共享 workflow 重复发布 review |
| 模型配置 | `AI_REVIEW_MODEL=gpt-6.1-sol`；`AI_REVIEW_REASONING_EFFORT=xhigh` | 已配置；本仓库托管执行待验证 |
| 本仓库技术栈 | pnpm + Node.js LTS monorepo；普通候选 CI 使用 `pull_request`，共享 review 不要求 consumer 安装 gh-aw | 兼容。应用语言、包管理器和 Docker 构建不影响 reusable workflow 接口 |
| 上游当前可运行性 | `knowledge-base` run `39351969803` 在当前上游 SHA `4a70b0c...` 上完成 Agent、发布、verdict 与 gate | 没有发现当前共享实现的普遍运行 blocker |

## 当前接入状态与剩余步骤

1. `TAVILY_API_KEY`、Actions event policy 和模型 variables 已配置。
2. 原生 Copilot auto-review 已关闭。
3. 当前分支新增 `.github/workflows/ai-review.yml`，使用完整权限集合、`gpt-6.1-sol`、`xhigh` 和 per-PR concurrency；仓库专属 prompt 延后到 [Issue #128](https://github.com/Soulike/website/issues/128) 的 Agent instructions 迁移后再评估。
4. Caller 合入默认分支后，通过新的 ready PR 事件验证。新增 caller 的 PR 本身不能验证它，因为 `pull_request_target` 从默认分支加载 workflow。
5. 确认完整运行、评论发布、reviewed head、model 和实际 check 名后，再把 `Review / Engine / AI review gate` 加入 `main` required checks。

若 event policy 阻止运行，或模型不可用、被替换，应修复对应配置后触发新的受支持 PR 事件。一般 setup、inference 或 publication 失败则应先修复原因，再对同一次运行选择 **Re-run failed jobs**，以复用已成功的阶段；所需 artifact 过期、被删除或发生 rerun 冲突时选择 **Re-run all jobs**。不能通过扩大 token、传入 PAT 或仅重跑旧 gate 来制造通过结果。

## 上游与平台结论

上游当前没有一个会普遍阻止 GitHub.com 公有仓库接入的已知故障。当前 `main` 已在独立消费仓库 `Soulike/knowledge-base` 的 [2026-10-20 运行](https://github.com/Soulike/knowledge-base/actions/runs/39351969803) 中完成 setup、Agent、评论发布、结构化 verdict 和 `AI review gate`；该运行记录的两个 reusable workflow SHA 都是本次调研的上游基线 `4a70b0c...`。这只能证明共享实现可以工作，不能证明新的消费仓库已经具备 Copilot entitlement、Tavily secret 或适用的 Actions policy。

真正可能阻断某个消费仓库的条件有四类：

1. 无法使用 `pull_request_target`，或管理员不能为公有仓库配置允许该事件的 Actions event policy。
2. 内置 `GITHUB_TOKEN` 没有 Copilot CLI 使用资格或计费入口，或政策禁止 `copilot-requests: write`。
3. 没有可用的 Tavily API key，或不能创建并显式映射 Actions secret。
4. 仓库/组织 Actions allowlist、token 权限政策或其他执行政策禁止共享 workflow 及其所需权限。

它们都是消费仓库的配置或 entitlement 条件。调用 YAML、分支 required check 和可选 review prompt 属于普通接入工作。

## 分类表

| 分类 | 条件 | 影响与判断 |
| --- | --- | --- |
| Confirmed blocker（条件成立时） | `pull_request_target` 被适用的 active policy 禁止，且管理员不能修改 | 共享 workflow 的 prepare 阶段明确只接受 `pull_request_target`；改成 `pull_request` 会失败。[上游指南](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L36-L67) |
| Confirmed blocker（条件成立时） | `GITHUB_TOKEN` 无 Copilot CLI entitlement/计费能力，或不能授予 `copilot-requests: write` | 权限声明本身不授予 entitlement。个人所有仓库由所有者的 Copilot seat 承担；组织仓库还需要允许组织计费的 Copilot CLI policy。[GitHub：Copilot CLI in Actions](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/copilot-cli-in-github-actions) |
| Confirmed blocker（条件成立时） | 无 Tavily key 或无法保存 repository secret | `TAVILY_API_KEY` 是 reusable workflow 的 required secret，prepare 还会检查非空。[公开接口](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/.github/workflows/ai-review.yml#L25-L27)；[消费方要求](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L23-L30) |
| Confirmed blocker（条件成立时） | Actions policy 不允许 `Soulike/ai-review-workflow`、GitHub 官方 actions、`github/gh-aw` 或完整 job 权限 | reusable workflow 不能把 caller 的权限提升到自己需要的级别；GitHub 也要求 caller 和 called workflow 都满足访问/allowlist policy。[GitHub reusable workflow 规则](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations)；[上游权限清单](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L81-L97) |
| Admin prerequisite | 公有消费仓库要为 caller path 配置允许 `pull_request_target` 的 active Actions event policy | GitHub 当前默认 policy 仍处于 evaluate mode，但将于 **2026-12-02** 对受影响仓库执行；届时无适用 allow policy 会被拦截。[GitHub 当前文档](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target#default-policy-for-pull_request_target) |
| Admin prerequisite | 首次成功后再把实际 gate check 加入 ruleset | 示例 job 名产生 `Review / Engine / AI review gate`，但必须以消费仓库实际 emitted check 为准并绑定 GitHub Actions。[上游验证步骤](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L201-L225) |
| Ordinary work | 新增 caller workflow、设置 reasoning effort、显式映射 secret、设置 per-PR concurrency | 上游提供完整示例；每个 caller run 只能调用一次，不能通过 matrix 重复调用。[调用示例](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L69-L151) |
| Ordinary work | 可选的仓库 review prompt | prompt 必须先进入目标分支；`pull_request_target` 从事件的 base commit 读取它。[prompt 契约](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L153-L179) |
| Governance decision | 接受跟随可变的 `main`，以及 review Skills/plugin 跟随 latest | 上游没有 release/tag 流程；普通 `main` 变更会直接影响消费者，review criteria 也可能在同一 workflow revision 间变化。[ADR 0002](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/adr/0002-consume-main-without-a-release-process.md)；[ADR 0003](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/adr/0003-follow-latest-review-skills.md) |
| Governance decision | 接受 `pull_request_target` + instruction-enforced candidate non-execution 模型 | 工作流 checkout 精确 base，fetch PR head 到 Git 对象库后移除凭据；Agent 被要求只读对象且不得执行 PR 代码。但上游明确说明该规则是 instruction，不是机械 command allowlist。[review source](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/.github/workflows/review.md#L78-L132)；[ADR 0007](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/adr/0007-retain-the-existing-agent-isolation-model.md) |
| Known restriction, not blocker | caller 文件不能命名为 `.github/workflows/review.lock.yml` | 当前 pinned runtime 会把这个文件名误认为 engine；使用 `review-pr.yml` 或 `ai-review.yml` 即可。[上游指南](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L69-L79)；[issue #12](https://github.com/Soulike/ai-review-workflow/issues/12) |
| Known upstream debt, currently mitigated | GitHub MCP v2 issue envelope 的 integrity 解码缺陷 | 当前 workflow 显式使用 GitHub MCP Server `v1.14.0` 规避；移除条件仍由 [issue #23](https://github.com/Soulike/ai-review-workflow/issues/23) 跟踪。它没有阻止当前基线在另一个 consumer 完成 review，但应继续视为上游兼容性债务。[workflow pin](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/.github/workflows/review.md#L51-L60) |
| Documentation drift | 上游指南写的是 2026-11-02，GitHub 当前文档写的是 2026-12-02 | requirement 不变：公有仓库最终必须有允许 `pull_request_target` 的适用 active policy。本次判断采用 GitHub 当前一手文档的日期。[上游旧日期](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L36-L43)；[GitHub 当前日期](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target#default-policy-for-pull_request_target) |

## 必须保持的调用契约

当前调用配置以 [`.github/workflows/ai-review.yml`](../../.github/workflows/ai-review.yml) 为仓库内唯一可执行来源，并与[上游完整 caller 示例](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L105-L151)保持契约一致。

固定要求：

- 只由 `pull_request_target` 触发调用。
- `reasoning-effort` 必须是 `none`、`minimal`、`low`、`medium`、`high`、`xhigh` 或 `max`，且所选 model 也必须支持它。
- 必须授予示例中的完整 job permissions；顶层 `permissions: {}` 用于避免其他 job 获得默认权限。
- 必须显式映射 `TAVILY_API_KEY`，不能使用 `secrets: inherit`，也不能传 PAT、`COPILOT_GITHUB_TOKEN` 或 `GH_AW_*` override。
- 同一个 caller run 只调用一次；用 per-PR concurrency 取消过时 head 的运行。
- `model` 可省略并使用 `auto`。显式模型是否可用只能由消费仓库的真实运行证明。
- `review-prompt-path` 和 `network_allowed` 均为可选输入。

## 安全与 fork PR

GitHub 将 `pull_request_target` 视为高信任事件：它使用 base repository 的 workflow 与 token，并可访问 secrets。GitHub 的安全边界要求这类 workflow 不 checkout 并执行不可信 PR 代码。[GitHub 安全说明](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

当前共享实现按以下方式控制风险：

- checkout 事件的精确 base SHA，而不是 PR head；
- 只把精确 PR head fetch 进 Git 对象库，校验 SHA 后供只读比较；
- Agent 启动前删除并验证 Git credentials；
- Agent 的 GitHub MCP 工具为 read-only；
- 只有受限 safe outputs 可以发布 `COMMENT` review 和结构化 verdict；
- workflow 不运行候选代码的测试，候选 CI 仍由消费仓库单独负责。

仍需接受的限制是：Agent 拥有广泛 Bash 能力，“不得执行 PR 代码”依赖 instruction 和 sandbox，而不是命令级机械禁止。上游也会在每次运行中安装 latest review Skills 和 latest knowledge-base plugin。若本仓库的供应链或 privileged-workflow 标准要求所有执行内容完全不可变，这会成为治理层面的 blocker，需要先改变上游分发策略，不能只改 caller YAML。

## `main` 与版本策略

上游没有 release 或 tag，明确要求 consumer 使用 `@main`。这让修复和升级自动到达消费仓库，也意味着同一个 caller 在不同时间可能执行不同的共享 implementation；review Skills/plugin 还独立跟随 latest。

GitHub 平台允许 reusable workflow 使用 branch、tag 或 commit SHA，并要求消费仓库的 Actions policy 允许所选引用。[GitHub reusable workflow 规则](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations) 如果本仓库必须固定供应链 revision，可以技术上改用完整 SHA，但这偏离上游当前“跟随 main、无升级 PR”的受支持维护模型，后续更新和安全修复要由消费仓库自己管理。应把它作为明确的治理选择，而不是无意中混用。

## 首次部署与验证顺序

新增 caller 的 PR 本身不能验证新部署的 `pull_request_target` workflow，因为该事件从默认分支读取可信 workflow。可执行顺序是：

1. 先把 caller、可选 prompt、repository variable 和 secret 配置落到默认分支；不要立即把尚未出现的 gate 设为 required。
2. 在 ready PR 上触发新的 `opened`、`reopened`、`ready_for_review` 或 `synchronize` 事件。
3. 在该消费仓库确认 setup、Copilot inference、评论发布和结构化 verdict 都成功；公有仓库同时检查 Policy insights 和 run annotation。
4. 确认 `github-actions[bot]` 发布的 `COMMENT` review 标明正确 reviewed head 和 model。
5. 从该次运行实际产生的 check 中选择 gate。示例命名下是 `Review / Engine / AI review gate`；caller job 改名会改变前缀。
6. 再把这个 check（来源 GitHub Actions）加入 branch ruleset。保留普通 CI 和人工合并控制；AI review 不是 GitHub approval，也不代表 merge readiness。

这一顺序来自[上游验证清单](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L201-L225)。

## 验证范围与限制

初始调研和后续接入完成了以下验证：

- 检查本仓库全部 committed workflow、Actions 总权限、默认 token 权限、repository Actions policies、secret 名称、variables、`main` branch protection 和 repository rulesets；
- 检查上游 `main` 的 caller 契约、公开 workflow、生成 workflow、ADR、open issues、CI 和消费方运行；
- 通过 run API 确认 `knowledge-base` run `39351969803` 调用的两个上游 workflow revision 均为 `4a70b0c...`，且所有 review stages 与 gate 成功；
- 对 caller 完成 YAML 解析，并使用精确忽略处理 `actionlint v1.7.12` 尚未识别的两个当前 GitHub permission scopes；
- 将 caller 的事件、permissions、callee、模型输入和 secret mapping 与上游当前 `review-pr.yml` 比较；
- 从 GitHub 官方文档源复核 reusable workflow 权限不会被 callee 提升，并确认 `copilot-requests` 与 `vulnerability-alerts` 是当前支持的 permission scopes；
- 读回 `TAVILY_API_KEY` 名称、模型 variables 和 Actions policy `#8840`；
- 运行 `git diff --check`。

尚未创建 PR、运行新 caller 或增加 required check。secret API 只返回名称，本次没有读取、请求或保存任何 secret value。

本机 `actionlint v1.7.12` 会把 `vulnerability-alerts` 和 `copilot-requests` 报为 unknown permission scopes。当前验证只精确忽略这两个已由 GitHub 官方文档和托管运行支持的 scope，其余 actionlint 检查保持启用。不应通过删除上游要求的权限来消除 linter schema 差异。

最终仍需消费仓库自己的 post-deployment run 证明 Copilot entitlement、Tavily secret、event policy、模型解析、review publication 和 gate 在同一次实际调用中共同成立。上游或 GitHub 设置发生变化后，应重新检查本报告中带日期的结论。
