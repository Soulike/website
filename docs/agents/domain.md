# Domain docs

This repository uses a single-context domain documentation layout.

## Before exploring

Read these sources when they exist and are relevant to the task:

- `GLOSSARY.md` at the repository root for established domain vocabulary.
- ADRs under `docs/adr/` for decisions affecting the area under change.

If these files do not exist, continue without reporting their absence. Create them lazily when terminology or a consequential decision needs a maintained owner.

## Layout

```text
/
├── GLOSSARY.md
└── docs/
    └── adr/
        ├── 0001-example-decision.md
        └── 0002-another-decision.md
```

`GLOSSARY.md` owns the repository's established domain terms. `docs/adr/` records consequential architectural decisions and their original rationale.

## Vocabulary

Use terms as defined in `GLOSSARY.md` in issues, specifications, code, tests, and documentation. Avoid introducing a synonym for an established term.

When a required concept has no established term, determine whether the codebase already expresses it under another name. Record a new term only when the distinction is meaningful and recurring.

## Architectural decisions

Read ADRs that affect the area before proposing or implementing a change. If proposed work conflicts with an ADR, identify the conflict explicitly instead of silently replacing the recorded decision.

Preserve ADRs as historical records. Mark a decision as superseded rather than rewriting its original context.
