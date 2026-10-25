# Issue tracker: GitHub

Issues, specs, and implementation tickets for this repository live in GitHub Issues. Use the `gh` CLI for issue operations and infer the repository from the current Git remote.

## Common operations

- Create an issue with `gh issue create`.
- Read an issue and its discussion with `gh issue view <number> --json number,title,body,labels,comments`.
- List issues with `gh issue list`, applying appropriate state and label filters.
- Comment with `gh issue comment <number>`.
- Apply or remove labels with `gh issue edit`.
- Close completed or rejected issues with `gh issue close`.

## Pull requests as a triage surface

PRs as a request surface: no.

External pull requests do not enter the issue-triage workflow automatically. GitHub uses one number space for issues and pull requests, so resolve an ambiguous number with `gh pr view` and then `gh issue view`.

## Publishing work

When a Skill says to publish a spec or ticket to the issue tracker, create a GitHub issue.

Apply the configured `ready-for-agent` label to work that is fully specified and safe for an implementation Agent to claim.

## Parent and child issues

Use GitHub sub-issues for tickets belonging to a parent spec when the installed `gh` version supports them. Otherwise, put `Part of #<parent>` at the beginning of the child issue and maintain a task list in the parent.

## Blocking relationships

Use GitHub native issue dependencies when available. A blocked ticket references the issues that must complete before it can begin.

When native dependencies are unavailable, add a `Blocked by: #<number>` line near the beginning of the ticket body.

A ticket is ready to claim only when all of its blockers are closed.
