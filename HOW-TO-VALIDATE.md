# How to validate path-scoped rules (Aaron)

Use **Cursor Desktop** Agent on this repo. Cloud Agent / CLI can follow the
same prompts, but the UI checks below assume Desktop.

Goal: prove that **web rules do not need to load** when only `apps/api` is
in play, and the reverse — the same efficiency goal as Claude `paths:`.

Official behaviour: [Rules](https://cursor.com/docs/context/rules) —
`alwaysApply: false` + `globs:` → auto-attached when a matching file is in
context.

---

## 0. Open the catalog (once)

1. Clone / open this repo in Cursor.
2. Open **Customize** in the sidebar → **Rules**.
3. Confirm you see the Project Rules from `.cursor/rules/*.mdc`.
4. Check types:
   - `always-no-secrets` and `always-demo-scope` → **Always Apply**
   - `web-*`, `api-*`, `shared-*`, `test-*` → **Apply to Specific Files**
   - `intelligent-perf` → **Apply Intelligently** (has a description, no globs)
   - `manual-migration-checklist` → **Apply Manually**

You are looking at *what exists*. The next steps prove *what attaches*.

---

## 1. Fresh API-only chat

1. **New Agent chat** (do not reuse a thread that already `@`-mentioned web).
2. In the chat input, attach **only**:
   - `@apps/api/src/server.ts`
   - `@apps/api/src/routes/users.ts`
3. Do **not** attach anything under `apps/web` or `packages/shared`.
4. Paste:

```text
Do not explore the rest of the repo. Use only the files I attached plus
whatever Project Rules Cursor already injected.

List every CANARY: token you can see in your current instructions.
Group them as Always Apply vs path-scoped.

Then answer: should a new handler in apps/api use Zod or a hand-rolled
validator? Quote the canary that told you.
```

### Expected

**Present**

- `ALWAYS-NO-SECRETS`
- `ALWAYS-DEMO-SCOPE`
- `API-ZOD`
- `API-ERROR-SHAPE`
- `API-NO-ANY`
- `API-HTTP-STATUS`
- `API-ROUTE-FILES` (you attached a file under `src/routes/`)

**Absent** (this is the proof)

- Any `WEB-*` canary
- Any `SHARED-*` canary
- `TEST-*` (you did not attach a `*.test.ts`)
- `INTELLIGENT-PERF` (you did not ask about performance)
- `MANUAL-MIGRATION` (you did not `@` that rule)

The model should say **Zod**, citing `API-ZOD`.

### Also look at the UI

After you send the message, inspect the chat **context** (context gauge /
rules list on that turn — wording varies slightly by Cursor version). You
should see the API-specific rules and the two Always Apply rules. You should
**not** need the five web rules in that turn.

---

## 2. Fresh web-only chat

1. **New Agent chat** again.
2. Attach **only**:
   - `@apps/web/src/Button.tsx`
   - `@apps/web/src/ui.ts`
3. Paste:

```text
Do not explore the rest of the repo. Use only the files I attached plus
whatever Project Rules Cursor already injected.

List every CANARY: token you can see in your current instructions.

If I add a new component next to Button.tsx, should I default-export it?
Quote the canary.
```

### Expected

**Present**

- Both `ALWAYS-*` canaries
- `WEB-NAMED-EXPORTS`
- `WEB-NO-INLINE-STYLES`
- `WEB-CLIENT-FETCH`
- `WEB-TSX-PROPS` (you attached a `.tsx`)

**Absent**

- All `API-*` canaries
- `WEB-CSS-TOKENS` (no `.css` file in context)
- `SHARED-*`, `TEST-*`, `INTELLIGENT-PERF`, `MANUAL-MIGRATION`

Answer: **no default export** — `WEB-NAMED-EXPORTS`.

Nested `apps/web/AGENTS.md` may also apply because you are in that tree.
That is a second path-scoping mechanism, not a substitute for `globs:`.

---

## 3. Shared-only chat

New chat. Attach only `@packages/shared/src/format.ts`.

```text
Do not explore the rest of the repo. List every CANARY: token in your
current instructions. May I add a React component to packages/shared?
```

### Expected

- `ALWAYS-*` + `SHARED-PURE` + `SHARED-NO-FRAMEWORK` + `SHARED-EXPORT-TYPES`
- No `WEB-*` or `API-*`
- Answer: **no** — `SHARED-PURE` / `SHARED-NO-FRAMEWORK`

---

## 4. Test-file chat

New chat. Attach only `@apps/api/src/server.test.ts`.

```text
Do not explore the rest of the repo. List every CANARY: token.
Which test runner should I use?
```

### Expected

- `ALWAYS-*`
- `TEST-VITEST`, `TEST-NO-SKIPPED`
- `API-*` canaries **may** also attach, because this path matches
  `apps/api/**` **and** `**/*.test.ts`. That is correct: two globs can fire
  on one file.
- Still no `WEB-*` unless you attached a web file.

---

## 5. Negative checks (easy to get wrong)

| Action | What should happen |
| --- | --- |
| Attach only `apps/api/src/server.ts` (no routes file) | `API-ROUTE-FILES` should **not** auto-attach (`globs: apps/api/src/routes/**`) |
| Attach only `apps/web/src/styles.css` | `WEB-CSS-TOKENS` yes; `WEB-TSX-PROPS` no |
| Ask about latency in a chat with no extra `@` files | `INTELLIGENT-PERF` **may** attach (description-based — Agent decides) |
| Type `@manual-migration-checklist` | `MANUAL-MIGRATION` appears |
| Reuse a chat after `@`-mentioning web + api | Both families can stay in context — **start a new chat** for a clean proof |

If a “should be absent” canary shows up, first check whether you (or the
agent) opened extra files. Auto-attach keys off **files in context**, not
the folder you happen to have highlighted in the tree.

---

## 6. `.cursorignore` is a different demo

1. In Agent, try `@local/private-notes.md`.
2. Access should be **blocked** (ignore file).
3. That does **not** mean API rules “excluded web.” Web source is still
   readable; it simply should not **inject web instructions** during an
   API-only chat.

See `.cursorignore` and [Ignore file](https://cursor.com/docs/reference/ignore-file).

---

## 7. Optional: migration talk track

```bash
npm run map-rules
```

You should get Claude `paths:` printed as Cursor `globs:` +
`alwaysApply: false`. Use [`docs/CLAUDE-TO-CURSOR-RULES.md`](docs/CLAUDE-TO-CURSOR-RULES.md)
in the room. Do not claim this script is an official importer.

---

## Pass / fail for the customer story

**Pass:** two clean chats (steps 1 and 2) show the other area’s canaries
absent, Always Apply present, and the model follows the matching convention
(Zod vs named exports).

**Fail:** every `CANARY:` from `.cursor/rules` appears in an API-only chat.
That means rules are being treated as Always Apply (or the chat already
pulled the whole tree). Check frontmatter (`alwaysApply: false`, `globs`
set) and start a new chat with a tight `@` file set.
