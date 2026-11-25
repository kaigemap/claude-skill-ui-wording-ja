# ui-wording-ja

Claude が書く日本語を、ふつうの言葉に寄せるための Claude Code スキルです。

Claude に日本語を書かせると、「新しいセッションから効きます」「設定を足します」「入れ方」のような、人がまず使わない言い回しが出てきます。画面を作らせれば、ボタンが「消す」「選ぶ」になったり、「正常に保存されました」のような翻訳調の文になったりします。このスキルを入れておくと、UI も README も、日本の一般的なアプリや技術記事で使われている言葉で書いてくれます。

- Claude 特有の言い回しを言い換え表で修正（効く → 反映される、足す → 追加する、決まり → ルール など）
- ボタンやメニューの用語を対応表で統一（消す → 削除、選ぶ → 選択、確認した → 確認済みにする など）
- トースト、空状態、確認ダイアログの書き方
- 直訳調、呼びかけ、感嘆符、なじみのないカタカナ語を避ける

おまけとして、ファイル編集後に UI の文言と Markdown をチェックするフックも入っています。

## インストール

```sh
git clone https://github.com/kaigemap/claude-skill-ui-wording-ja.git ~/.claude/skills/ui-wording-ja
```

フックも使う場合は、Claude Code で「UI の言葉の検査を入れて」と頼むと `~/.claude/settings.json` に設定されます。反映は次のセッションからです。フックの実行には Node.js が必要です。

## 構成

- `SKILL.md` … スキル本体
- `terms.md` … ボタン・メニュー・リンクの用語の対応表
- `plain-words.md` … Claude 特有の言い回しの言い換え表
- `guard-ja-ui-verbs.mjs` … チェック用のフック（PostToolUse）

## English

A Claude Code skill that keeps the Japanese Claude writes natural: replacement tables for Claude's odd word choices and for button verbs, plus rules for toasts, empty states and confirmation dialogs. An optional PostToolUse hook flags those words in UI strings and Markdown. Install with `git clone https://github.com/kaigemap/claude-skill-ui-wording-ja.git ~/.claude/skills/ui-wording-ja`. The skill itself is written in Japanese.

## License

MIT
