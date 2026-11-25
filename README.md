# ui-wording-ja（日本語の UI の文言）

Claude Code 用のスキル。日本語の UI の文言を、日本のふつうのアプリの言葉で書かせます。

- ボタン・メニューの語は対応表から選ぶ（消す → 削除、選ぶ → 選択、確認した → 確認済みにする）
- トースト・空のときの文・確認ダイアログの書き方
- 英語の直訳、呼びかけ、感嘆符、定着していないカタカナ語を避ける

UI のファイルを書いたあとに、ボタンに置かない語がないかを確かめる hook も付いています。

## 入れ方

```sh
git clone https://github.com/kaigemap/claude-skill-ui-wording-ja.git ~/.claude/skills/ui-wording-ja
```

hook も使うときは、Claude Code に「UI の言葉の検査を入れて」と言うと、`~/.claude/settings.json` に足します。新しいセッションから効きます。hook には Node.js が要ります。

## ファイル

- `SKILL.md`: 決まりの本体
- `terms.md`: ボタン・メニュー・リンクの語の対応表。hook もこの表を読みます
- `guard-ja-ui-verbs.mjs`: hook（PostToolUse）

## English

A Claude Code skill for writing Japanese UI copy the way ordinary Japanese apps do: a table of button verbs to avoid and their standard replacements, plus rules for toasts, empty states and confirmation dialogs. An optional PostToolUse hook flags short UI strings that use the avoided verbs. Install with `git clone https://github.com/kaigemap/claude-skill-ui-wording-ja.git ~/.claude/skills/ui-wording-ja`. The skill text is in Japanese.

## License

MIT
