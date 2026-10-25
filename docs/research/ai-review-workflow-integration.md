# 将 `Soulike/ai-review-workflow` 接入 `Soulike/website` 的 blocker 调研

- 调研日期：2026-10-25
- 本仓库基线：[`876bef367ce3c65793557ccce6a7ee7ef4e058f2`](https://github.com/Soulike/website/commit/876bef367ce3c65793557ccce6a7ee7ef4e058f2)（`main`）
- 上游基线：[`4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5`](https://github.com/Soulike/ai-review-workflow/commit/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5)（`main`，2026-10-18）

本文核对共享工作流、GitHub 平台契约，以及本仓库当前的 Actions、secret、policy、ruleset 和 workflow 状态。仓库设置来自 2026-10-25 的 authenticated GitHub API 只读快照；后续设置变更会使对应结论失效。

## 本仓库结论

**可以接入，没有架构性或代码库层面的 blocker。** 但本仓库当前还不能算具备完整、可持续运行条件；有两项已确认且可修复的配置 blocker：

1. **缺少必需的 `TAVILY_API_KEY` repository secret。** 当前 Actions secrets 只有 `DOCKERHUB_USERNAME` 和 `DOCKERHUB_TOKEN`。上游把 `TAVILY_API_KEY` 声明为 required secret，caller 不映射或值为空时不能完成 review。
2. **缺少允许 caller 使用 `pull_request_target` 的 active Actions event policy。** 本仓库是 public repository，`GET /repos/Soulike/website/actions/policies` 返回 `total_count: 0`。GitHub 当前默认 policy 仍处于 evaluate mode，但计划于 **2026-12-02** 执行拦截；上游接入契约也明确要求 public consumer 配置适用的 active policy。

另有一项必须由首次托管运行确认的条件：**Actions `GITHUB_TOKEN` 是否能实际使用 Copilot CLI。** 本仓库属于个人账号 `Soulike`，GitHub 当前文档说明个人仓库的 `GITHUB_TOKEN` Copilot 用量计入仓库所有者的 Copilot seat。本仓库已有成功的原生 Copilot code review 和 active `copilot_code_review` ruleset，说明账号具有 Copilot review 能力，但这不能严格证明 `copilot-requests: write` 的 Actions 调用路径。首次 post-deployment run 才是充分证据；若该调用被 entitlement、预算或账号政策拒绝，它会成为第三项 blocker。

这三项都不需要修改应用代码。当前登录用户对仓库有 admin 权限，因此 policy、secret 和 branch rule 的配置没有发现需要其他组织管理员处理的结构性障碍。

## 本仓库配置对照

| 检查项 | 当前证据 | 判断 |
| --- | --- | --- |
| 仓库与可见性 | `Soulike/website`，public，个人账号所有，默认分支 `main` | 兼容。public caller 可以调用 public reusable workflow |
| Actions 总开关与 allowlist | Actions enabled；`allowed_actions: all`；`sha_pinning_required: false` | 兼容。没有 allowlist 或 SHA-only policy 阻止 `Soulike/ai-review-workflow@main` 及其 nested actions |
| 默认 token 权限 | `default_workflow_permissions: read`；caller 可声明 job-level permissions | 兼容。按上游示例显式授予完整 job permissions 即可 |
| Actions PR approval | `can_approve_pull_request_reviews: false` | 兼容。共享 workflow 发布的是 `COMMENT` review，不依赖 GitHub approval |
| 必需 secret | 只有两个 Docker Hub secrets；没有 `TAVILY_API_KEY` | **Confirmed blocker** |
| `pull_request_target` policy | repository Actions policy 数量为 0 | **Confirmed blocker** |
| 外部 reusable workflow | 仓库允许所有 actions/workflows；上游为 public | 兼容 |
| 现有 caller 文件 | `.github/workflows/` 下没有 `ai-review.yml`、`review-pr.yml` 或 `review.lock.yml` | 兼容。建议新增 `.github/workflows/ai-review.yml` |
| 当前 branch protection | `main` 只要求 GitHub Actions 的 `ci-success`；strict；要求解决对话；0 个 approval | 兼容。先部署并验证，再增加 AI gate，不会形成初始化死锁 |
| 现有 AI review | active Copilot ruleset 对默认分支启用 `review_on_push`；历史 PR 有成功 Copilot reviews | 不阻塞，但接入后会有两套自动 review，需要决定是否保留重复反馈与成本 |
| 本仓库技术栈 | Bun monorepo；普通候选 CI 使用 `pull_request`，共享 review 不要求 consumer 安装 pnpm/gh-aw | 兼容。应用语言、Bun 和 Docker 构建不影响 reusable workflow 接口 |
| 上游当前可运行性 | `knowledge-base` run `39351969803` 在当前上游 SHA `4a70b0c...` 上完成 Agent、发布、verdict 与 gate | 没有发现当前共享实现的普遍运行 blocker |

## 建议的最小接入方案

1. 采用 `.github/workflows/ai-review.yml` 作为 caller，使用下文的完整权限集合、`reasoning-effort: high` 和默认 `model: auto`。先不增加仓库专属 prompt，以缩小首次验证面。
2. 创建 `TAVILY_API_KEY` repository secret。只保存 key，不把值写入仓库、文档、变量或命令输出。
3. 创建 active repository Actions policy，只包含 `.github/workflows/ai-review.yml`，只允许 `pull_request_target`。无需放宽其他 workflow 的事件范围。
4. 合并 caller 后，通过新的 ready PR 事件验证。新增 caller 的 PR 本身不能验证它，因为 `pull_request_target` 从默认分支加载 workflow。
5. 确认完整运行、评论发布、reviewed head、model 和实际 check 名后，再把 `Review / Engine / AI review gate` 加入 `main` required checks。
6. 根据反馈重复度和成本，决定继续保留还是关闭现有原生 Copilot auto-review ruleset。这个选择不影响共享 workflow 的正确性。

解除两项 confirmed blocker 后，推荐进入一次真实验证，而不是继续增加静态配置。若 Copilot inference 成功，本仓库没有其他已知 blocker；若失败，应按托管日志判断 entitlement、预算或模型可用性，而不是扩大 token 或给 workflow 传 PAT。

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

消费方 caller 应以 job 方式调用：

```yaml
name: Review pull request

on:
  pull_request_target:
    types: [opened, reopened, ready_for_review, synchronize, converted_to_draft]

permissions: {}

jobs:
  review:
    name: Review
    concurrency:
      group: ${{ github.workflow }}-ai-review-pr-${{ github.event.pull_request.number }}
      cancel-in-progress: true
    permissions:
      actions: read
      checks: read
      contents: read
      discussions: read
      issues: read
      pull-requests: write
      security-events: read
      statuses: read
      vulnerability-alerts: read
      copilot-requests: write
    uses: Soulike/ai-review-workflow/.github/workflows/ai-review.yml@main
    with:
      reasoning-effort: high
    secrets:
      TAVILY_API_KEY: ${{ secrets.TAVILY_API_KEY }}
```

来源：[上游完整 caller 示例](https://github.com/Soulike/ai-review-workflow/blob/4a70b0c965fed1ec5a7731594ddaa6c73cdb01a5/docs/consumer-setup.md#L105-L151)。

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

本次完成了以下只读验证：

- 检查本仓库全部 committed workflow、Actions 总权限、默认 token 权限、repository Actions policies、secret 名称、variables、`main` branch protection 和 repository rulesets；
- 检查上游 `main` 的 caller 契约、公开 workflow、生成 workflow、ADR、open issues、CI 和消费方运行；
- 通过 run API 确认 `knowledge-base` run `39351969803` 调用的两个上游 workflow revision 均为 `4a70b0c...`，且所有 review stages 与 gate 成功；
- 将建议 caller 保存到临时文件并完成 YAML 解析；
- 运行 `git diff --check` 检查本文格式。

没有创建 secret、Actions policy、caller workflow、PR、workflow run 或 required check。secret API 只返回名称，本次没有读取、请求或保存任何 secret value。

本机 `actionlint v1.7.12` 会把 `vulnerability-alerts` 和 `copilot-requests` 报为 unknown permission scopes。这是当前 linter schema 与 GitHub 平台的兼容性差异，不应通过删除上游要求的权限来消除；GitHub 官方文档和当前上游 SHA 的托管成功运行表明平台接受这些权限。本仓库当前 CI 也没有 actionlint gate，因此它不是接入 blocker。若以后加入 actionlint，应先解决或显式记录这两个 preview/current-platform scope 的校验差异。

最终仍需消费仓库自己的 post-deployment run 证明 Copilot entitlement、Tavily secret、event policy、模型解析、review publication 和 gate 在同一次实际调用中共同成立。上游或 GitHub 设置发生变化后，应重新检查本报告中带日期的结论。
