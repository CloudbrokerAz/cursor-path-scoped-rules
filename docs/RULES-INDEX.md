# Project Rules index

Official behaviour (do not invent extra features):
[cursor.com/docs/context/rules](https://cursor.com/docs/context/rules)

| File | Type | Globs / trigger | Canary |
| --- | --- | --- | --- |
| `always-no-secrets.mdc` | Always Apply | every chat | `ALWAYS-NO-SECRETS` |
| `always-demo-scope.mdc` | Always Apply | every chat | `ALWAYS-DEMO-SCOPE` |
| `web-named-exports.mdc` | Specific Files | `apps/web/**` | `WEB-NAMED-EXPORTS` |
| `web-no-inline-styles.mdc` | Specific Files | `apps/web/**` | `WEB-NO-INLINE-STYLES` |
| `web-client-fetch.mdc` | Specific Files | `apps/web/**` | `WEB-CLIENT-FETCH` |
| `web-tsx-props.mdc` | Specific Files | `apps/web/**/*.tsx` | `WEB-TSX-PROPS` |
| `web-css-tokens.mdc` | Specific Files | `apps/web/**/*.css` | `WEB-CSS-TOKENS` |
| `api-zod.mdc` | Specific Files | `apps/api/**` | `API-ZOD` |
| `api-error-shape.mdc` | Specific Files | `apps/api/**` | `API-ERROR-SHAPE` |
| `api-no-any.mdc` | Specific Files | `apps/api/**` | `API-NO-ANY` |
| `api-http-status.mdc` | Specific Files | `apps/api/**` | `API-HTTP-STATUS` |
| `api-route-files.mdc` | Specific Files | `apps/api/src/routes/**` | `API-ROUTE-FILES` |
| `shared-pure.mdc` | Specific Files | `packages/shared/**` | `SHARED-PURE` |
| `shared-no-framework.mdc` | Specific Files | `packages/shared/**` | `SHARED-NO-FRAMEWORK` |
| `shared-export-types.mdc` | Specific Files | `packages/shared/**` | `SHARED-EXPORT-TYPES` |
| `test-vitest.mdc` | Specific Files | `**/*.test.ts` | `TEST-VITEST` |
| `test-no-skipped.mdc` | Specific Files | `**/*.test.ts` | `TEST-NO-SKIPPED` |
| `intelligent-perf.mdc` | Apply Intelligently | description only | `INTELLIGENT-PERF` |
| `manual-migration-checklist.mdc` | Apply Manually | `@`-mention only | `MANUAL-MIGRATION` |

**19 rules.** 2 Always Apply. 15 glob-scoped. 1 intelligent. 1 manual.

When only `apps/api/src/server.ts` is in context, the web and shared glob rules
should not auto-attach. Always Apply canaries still appear.
