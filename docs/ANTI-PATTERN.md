# Anti-pattern: dump every rule into every chat

This is the failure mode when pathing is not honoured: hundreds of
instructions enter the context window whether or not they apply to the files
in play. Tokens burn. The model gets contradictory guidance from unrelated
areas. On a large ruleset, that cost is real.

## What it looks like

1. **One giant `AGENTS.md`** at the repo root that concatenates web, API,
   shared, test, infra, and release conventions.
2. **Every Project Rule set to Always Apply** (`alwaysApply: true`) — globs
   are then ignored, per Cursor docs.
3. **Claude rules without `paths:`** (or Cursor rules without `globs:`) so
   every file loads at session start.

This repo does **not** put that giant file at the root on purpose. The
example below is documentation only.

```markdown
# DO NOT copy this to /AGENTS.md

## Web
- named exports, no inline styles, CSS tokens, no API source imports, …
## API
- Zod, error shape, no any, HTTP status map, route file layout, …
## Shared
- pure functions, no framework, export types from one module, …
## Tests
- Vitest only, no skipped tests, …
## Infra / release / codegen / terraform / …
- (imagine ~280 more sections)
```

## Why path-scoped INCLUDE is the fix

Cursor Project Rules with `alwaysApply: false` and `globs:` auto-attach
**only when a matching file is in context**. That is include-via-glob for
instruction efficiency — the same goal as Claude Code `paths:`.

Keep Always Apply for a handful of tiny, repo-wide facts (this demo has two
short ones). Put area conventions on globs.

## What this is not

This is not “exclude `apps/web` from the agent.” Blocking folders is
`.cursorignore`. See the README note and `HOW-TO-VALIDATE.md` step 6.
