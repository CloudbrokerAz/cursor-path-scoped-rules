#!/usr/bin/env node
/**
 * Conceptual mapper: Claude Code `.claude/rules` `paths:` → Cursor `globs:`.
 *
 * This is a conceptual mapping helper, not an official importer.
 * Cursor does not automatically convert Claude path rules.
 *
 * Usage: node scripts/map-claude-rules.mjs
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const CLAUDE_RULES = join(ROOT, ".claude", "rules");

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { raw: "", fields: {} };
  const raw = match[1];
  const fields = {};
  let current = null;
  for (const line of raw.split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+["']?(.+?)["']?\s*$/);
    if (listItem && current) {
      fields[current] = Array.isArray(fields[current])
        ? [...fields[current], listItem[1]]
        : [listItem[1]];
      continue;
    }
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    current = kv[1];
    fields[current] = kv[2] === "" ? [] : kv[2].replace(/^["']|["']$/g, "");
  }
  return { raw, fields };
}

function toGlobs(fields) {
  const value = fields.paths ?? fields.globs;
  if (value == null) return null;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

const files = walk(CLAUDE_RULES);
if (files.length === 0) {
  console.log("No `.claude/rules/*.md` files found.");
  process.exit(0);
}

console.log("Claude `paths:` → Cursor `globs:` (conceptual mapping)\n");
console.log("Not an official importer. Review each rule before copying.\n");

for (const file of files) {
  const rel = relative(ROOT, file);
  const { fields } = parseFrontmatter(readFileSync(file, "utf8"));
  const globs = toGlobs(fields);
  const stem = rel.replace(/^\.claude\/rules\//, "").replace(/\.md$/, "");
  const dest = `.cursor/rules/${stem}.mdc`;

  console.log(`# ${rel}`);
  if (!globs) {
    console.log("  Claude: no `paths:` (loads every session, like Always Apply)");
    console.log(`  Cursor: ${dest}`);
    console.log("  ---\n  alwaysApply: true\n  ---\n");
    continue;
  }
  console.log(`  Claude paths: ${globs}`);
  console.log(`  Cursor file:  ${dest}`);
  console.log("  ---");
  console.log(`  globs: ${globs}`);
  console.log("  alwaysApply: false");
  console.log("  ---\n");
}
