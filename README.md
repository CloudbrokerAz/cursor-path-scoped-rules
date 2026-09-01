# Path-scoped Project Rules in Cursor

A public demo of how Cursor Project Rules use `globs` and
`alwaysApply: false` so only matching instructions enter the context
window.

**The problem:** A team with hundreds of path- or glob-scoped rules needs
those rules to load only when matching files are in play. In Claude Code,
rules with `paths:` only load when matching files are in play. Without
pathing, every rule dumps into the context window and burns tokens. Can
Cursor do the same? Are Claude rules transferable?

**Short answer:** Yes — Cursor Project Rules with `globs` and
`alwaysApply: false` auto-attach when a matching file is in context. That is
the same *efficiency goal* as Claude `paths:`. Claude rules are
**conceptually transferable** (`paths:` → `globs:`); they are **not**
documented as a fully automatic import.

This is **path-scoped INCLUDE for instruction loading**. It is not “block
the agent from this folder.” Folder blocking is `.cursorignore`. Do not
conflate the two.

---

## The problem (plain English)

Large language models start each completion without memory of your last chat.
Rules are how you inject standing instructions into the **context window**.

If you have ~300 conventions (web, API, shared libs, tests, infra, …) and
you mark them all “always on,” every chat pays for all 300 — even when the
engineer is only touching `apps/api`. That is expensive and noisy. Tokens
burn when all rules load into the window, whether or not they apply to the
files in play.

Claude Code’s fix: `.claude/rules` files with YAML `paths:` globs. A rule
loads when matching files are in play.

Cursor’s fix: `.cursor/rules/*.mdc` files with `globs:` and
`alwaysApply: false`. Same idea. Official docs:

> Auto-attached when a matching file is in context.

Source: [Cursor Rules](https://cursor.com/docs/context/rules)

---

## What Cursor actually does (cited, not invented)

From the official rules table:

| `alwaysApply` | `description` | `globs` | Behaviour |
| --- | --- | --- | --- |
| `true` | — | — | Always included. Globs and description are ignored. |
| `false` | — | provided | **Auto-attached when a matching file is in context.** |
| `false` | provided | omitted | Agent reads the description and pulls the rule in when relevant. |
| `false` | omitted | omitted | Included only when you `@`-mention the rule. |

This repo uses all four types so you can see the contrast. The large-ruleset
story is the second row: **many small rules, only some attach**.

Cursor also supports **nested `AGENTS.md`** in subdirectories. Those files
apply when you work in that directory or its children, and combine with
parent `AGENTS.md` (more specific wins on conflict). This repo has a root
`AGENTS.md` plus `apps/web/AGENTS.md`.

Docs: [cursor.com/docs/context/rules](https://cursor.com/docs/context/rules)

---

## Not the same as `.cursorignore`

| Mechanism | Question it answers | This repo |
| --- | --- | --- |
| Path-scoped Project Rules (`globs:`) | “Which **instructions** should enter the prompt?” | `.cursor/rules/*.mdc` |
| `.cursorignore` | “Which **files** may the agent/Tab/@ mention see?” | `.cursorignore` → `local/` |

`.cursorignore` **blocks access** (Agent, Tab, Inline Edit, `@` mentions).
It does not attach or detach rules. Path-scoped rules **include** guidance
when you are already working on matching files.

Docs: [Ignore file](https://cursor.com/docs/reference/ignore-file)

---

## Repo map

```text
apps/web/                 UI toy (named exports, CSS tokens)
apps/api/                 HTTP toy (Zod, error shape)
packages/shared/          Pure types/helpers (no framework)
.cursor/rules/*.mdc       19 Project Rules (2 always-on, 15 glob-scoped, …)
AGENTS.md                 Short root note
apps/web/AGENTS.md        Nested AGENTS.md (second path-scoping demo)
.claude/rules/            Sample Claude `paths:` rules for the mapping notes
docs/ANTI-PATTERN.md      What happens if everything is Always Apply
docs/CLAUDE-TO-CURSOR-RULES.md
HOW-TO-VALIDATE.md        Validation checklist
```

Toy TypeScript only — enough real files for globs to match. Not a product.

**19 rules, short on purpose.** The demo is about *selection*, not rule
quality. Each glob-scoped rule has a `CANARY:…` token so you can see what
attached. Full table: [`docs/RULES-INDEX.md`](docs/RULES-INDEX.md).

---

## Anti-pattern (300-rule window fill)

If every rule is Always Apply, or you paste all 300 into one root
`AGENTS.md`, Cursor will include them in every Agent chat. Globs on an
Always Apply rule are **ignored**. That is the burn.

The healthy pattern: tiny Always Apply (this demo has two), everything else
glob-scoped or intelligent/manual.

Details: [`docs/ANTI-PATTERN.md`](docs/ANTI-PATTERN.md)

---

## Claude transfer (do not overclaim)

| Claim | Status |
| --- | --- |
| `paths:` and `globs:` are the same *idea* (include instructions on matching files) | Yes |
| Field names and file formats differ (`.md` + `paths:` vs `.mdc` + `globs:`) | Yes |
| You can map them with a small script / by hand | Yes — `npm run map-rules` |
| Cursor automatically imports Claude path rules | **Not claimed** |
| Claude Skills import | Discussed as tested separately — **not this repo** |

Mapping notes: [`docs/CLAUDE-TO-CURSOR-RULES.md`](docs/CLAUDE-TO-CURSOR-RULES.md)

---

## How to prove it

Open this repo in **Cursor Desktop**, then follow
[`HOW-TO-VALIDATE.md`](HOW-TO-VALIDATE.md).

You should see:

- With only `apps/api` files in context → API canaries, **not** web canaries
- With only `apps/web` files in context → web canaries, **not** API canaries
- Always Apply canaries in both chats
- `.cursorignore` blocks `local/`, and that still is not rule scoping

---

## License

MIT.
