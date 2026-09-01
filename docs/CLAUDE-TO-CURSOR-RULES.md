# Claude `paths:` → Cursor `globs:`

Whether Claude path-scoped rules transfer: conceptually yes.
Automatically, no — not as a first-class “import my `paths:`” product feature
documented here.

## Side-by-side

| | Claude Code | Cursor |
| --- | --- | --- |
| Folder | `.claude/rules/` (`.md`, recursive) | `.cursor/rules/` (`.mdc` required) |
| Path include | YAML `paths:` | Frontmatter `globs:` |
| Unscoped / always | Rule with no `paths:` loads at launch | `alwaysApply: true` |
| Lazy / matching files | `paths:` rule loads when matching files are in play | `alwaysApply: false` + `globs:` auto-attaches when a matching file is in context |
| Other modes | (skills are a separate Claude mechanism) | Apply Intelligently (`description`, no globs); Apply Manually (`@rule`) |
| Nested markdown | Nested `CLAUDE.md` / on-demand subdirectory files | Nested `AGENTS.md` in subdirectories |

Official Cursor source: [Rules](https://cursor.com/docs/context/rules).
Official Claude source: [How Claude remembers your project](https://code.claude.com/docs/en/memory).

## Mapping

```yaml
# Claude .claude/rules/api-zod.md
---
paths:
  - "apps/api/**"
---
```

```yaml
# Cursor .cursor/rules/api-zod.mdc
---
globs: apps/api/**
alwaysApply: false
---
```

Multiple Claude paths become a comma-separated Cursor `globs` string:

```yaml
# Claude
paths:
  - "apps/web/**/*.ts"
  - "apps/web/**/*.tsx"

# Cursor
globs: apps/web/**/*.ts, apps/web/**/*.tsx
alwaysApply: false
```

## What we are not claiming

- Cursor does **not** silently ingest `.claude/rules` `paths:` as Project Rules.
- A remote GitHub import exists for **Cursor `.mdc` files**, not as a
  documented Claude `paths:` converter.
- Skills import was discussed as tested separately. Do not treat this repo as
  proof that Claude Skills transfer.

## Try the helper

Sample Claude rules live in `.claude/rules/`. From the repo root:

```bash
npm run map-rules
```

The script prints suggested Cursor frontmatter. Review by hand; it is a
conceptual mapper, not an official importer.
