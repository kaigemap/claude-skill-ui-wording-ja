# ui-wording-ja

日本語UIの文言を整えるための Claude Code スキルです。

Claude に画面を作らせると、ボタンが「消す」「選ぶ」になっていたり、「正常に保存されました」のような翻訳調の文が出てきたりします。このスキルを入れておくと、日本の一般的なアプリで使われている言い回しに寄せて書いてくれます。

- ボタンやメニューの用語を対応表で統一（消す → 削除、選ぶ → 選択、確認した → 確認済みにする など）
- トースト、空状態、確認ダイアログの書き方
- 直訳調、呼びかけ、感嘆符、なじみのないカタカナ語を避ける

おまけとして、ファイル編集後にボタンの文言をチェックするフックも入っています。

## インストール

```sh
git clone https://github.com/kaigemap/claude-skill-ui-wording-ja.git ~/.claude/skills/ui-wording-ja
```

フックも使う場合は、Claude Code で「UI の言葉の検査を入れて」と頼むと `~/.claude/settings.json` に設定されます。反映は次のセッションからです。フックの実行には Node.js が必要です。

## 構成

- `SKILL.md` … スキル本体
- `terms.md` … ボタン・メニュー・リンクの用語の対応表（フックもこれを参照）
- `guard-ja-ui-verbs.mjs` … チェック用のフック（PostToolUse）

## English

A Claude Code skill that keeps Japanese UI copy natural: a table of button verbs and their standard replacements, plus rules for toasts, empty states and confirmation dialogs. An optional PostToolUse hook flags short UI strings that use the avoided verbs. Install with `git clone https://github.com/kaigemap/claude-skill-ui-wording-ja.git ~/.claude/skills/ui-wording-ja`. The skill itself is written in Japanese.

## License

MIT
