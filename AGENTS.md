# Factory demo (root)

This is a toy monorepo used to prove Cursor path-scoped Project Rules.

Keep this file short. Area-specific instructions live in `.cursor/rules/*.mdc`
with `globs:` so they attach only when matching files are in context.

- `apps/web` — UI package
- `apps/api` — HTTP API package
- `packages/shared` — shared types and pure helpers

Do not dump every convention into this file. That is the anti-pattern this
repo exists to avoid. See `docs/ANTI-PATTERN.md`.
