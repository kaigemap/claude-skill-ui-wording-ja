#!/usr/bin/env node
// Edit / Write のあと、UI のファイルに書いた文字列に、置かない語がないかを見る。
// - 句点・読点を含まない 20 字以下の文字列（ボタン・ラベルなど）: terms.md（ボタンの語）と plain-words.md（Claude語）の表
// - それより長い文（ダイアログ・トーストなど）: plain-words.md の表だけ
// 表は同じフォルダの .md の対応表の左の列（「・」区切り）から読む。見つけたら exit 2 で Claude に知らせる（書いた内容は戻さない）。
import { readFileSync } from 'node:fs';
import { join, extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const UI_EXT = new Set(['.html', '.htm', '.js', '.mjs', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.json']);
// 表の左の列の語を含んでいても使ってよい語。これを除いてから見る
const ALLOWED = ['元に戻す', '取り消す', 'やり直す', '書き出し', '取り込み', '読み込み', '切り替え', '窓口'];

let input;
try { input = JSON.parse(readFileSync(0, 'utf8')); } catch { process.exit(0); }
const ti = input.tool_input ?? {};
const file = ti.file_path ?? '';
const ext = extname(file).toLowerCase();
// このスキル自身の表や説明は、語の例を含むので見ない
if (resolve(file).startsWith(HERE + '/')) process.exit(0);
if (!UI_EXT.has(ext)) process.exit(0);
const text = [ti.content, ti.new_string, ...(ti.edits ?? []).map(e => e.new_string)].filter(Boolean).join('\n');
if (!text) process.exit(0);

// 長い語から当てる（「確かめる」を「確かめ」より先に）
function table(...names) {
  const pairs = [];
  for (const name of names) {
    let md;
    try { md = readFileSync(join(HERE, name), 'utf8'); } catch { continue; }
    for (const line of md.split('\n')) {
      const m = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/);
      if (!m || m[1] === '使わない' || m[1].startsWith('-')) continue;
      for (const w of m[1].split('・')) pairs.push([w, m[2]]);
    }
  }
  return pairs.sort((a, b) => b[0].length - a[0].length);
}

const hits = new Map();
function check(s, pairs) {
  let t = s;
  for (const a of ALLOWED) t = t.split(a).join('');
  for (const [w, use] of pairs) {
    if (!t.includes(w)) continue;
    const key = `${w}→${use}`;
    if (!hits.has(key)) hits.set(key, `「${s.length > 30 ? s.slice(0, 30) + '…' : s}」の「${w}」→ ${use}`);
    t = t.split(w).join('');
  }
}

const short = table('terms.md', 'plain-words.md'), long = table('plain-words.md');
// 引用符の中とタグの間の文字列を取り出す
for (const m of text.matchAll(/"([^"\n]*)"|'([^'\n]*)'|`([^`\n]*)`|>([^<>\n]+)</g)) {
  const s = (m[1] ?? m[2] ?? m[3] ?? m[4]).trim();
  if (!s || !/[\u3040-\u30ff\u4e00-\u9fff]/.test(s)) continue;
  check(s, s.length <= 20 && !/[、。，．]/.test(s) ? short : long);
}

if (!hits.size) process.exit(0);
console.error(`UI の文言に、使わない語があります（ui-wording-ja スキルの terms.md・plain-words.md）。\n${[...hits.values()].map(h => '- ' + h).join('\n')}`);
process.exit(2);
