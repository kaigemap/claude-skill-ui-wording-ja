#!/usr/bin/env node
// Edit / Write のあと、UI のファイルに書いた短い文字列に、ボタンに置かない和語の動詞がないかを見る。
// 語の一覧は、同じフォルダの terms.md の対応表の左の列（「・」区切り）から読む。
// 見るのは句点・読点を含まない 20 字以下の文字列だけ。見つけたら exit 2 で Claude に知らせる（書いた内容は戻さない）。
import { readFileSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const UI_EXT = new Set(['.html', '.htm', '.js', '.mjs', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.json']);
// terms.md の「使ってよい」和語。左の列の語を含んでいても、これを除いてから見る
const ALLOWED = ['元に戻す', '取り消す', 'やり直す', '書き出し', '取り込み', '読み込み', '切り替え'];

let input;
try { input = JSON.parse(readFileSync(0, 'utf8')); } catch { process.exit(0); }
const ti = input.tool_input ?? {};
if (!UI_EXT.has(extname(ti.file_path ?? '').toLowerCase())) process.exit(0);
const text = [ti.content, ti.new_string, ...(ti.edits ?? []).map(e => e.new_string)].filter(Boolean).join('\n');
if (!text) process.exit(0);

let terms;
try { terms = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'terms.md'), 'utf8'); } catch { process.exit(0); }
const pairs = [];
for (const line of terms.split('\n')) {
  const m = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/);
  if (!m || m[1] === '使わない' || m[1].startsWith('-')) continue;
  for (const w of m[1].split('・')) pairs.push([w, m[2]]);
}

// 引用符の中とタグの間の文字列を取り出す
const strings = [];
for (const m of text.matchAll(/"([^"\n]*)"|'([^'\n]*)'|`([^`\n]*)`|>([^<>\n]+)</g)) strings.push((m[1] ?? m[2] ?? m[3] ?? m[4]).trim());

const hits = new Map();
for (const s of strings) {
  if (!s || s.length > 20 || /[、。，．]/.test(s) || !/[぀-ヿ一-鿿]/.test(s)) continue;
  let t = s;
  for (const a of ALLOWED) t = t.split(a).join('');
  for (const [w, use] of pairs) if (t.includes(w)) hits.set(s, `「${s}」の「${w}」→ ${use}`);
}
if (!hits.size) process.exit(0);
console.error(`UI の文言に、ボタンに置かない語があります（ui-wording-ja スキルの terms.md）。本文の文なら気にしなくてよいです。\n${[...hits.values()].map(h => '- ' + h).join('\n')}`);
process.exit(2);
