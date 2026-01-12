# コンテンツ管理 (Content Management)

このプロジェクトでは、パターン解説などの静的コンテンツを Markdown ファイル (`.md`) で管理し、**Codegen (コード生成)** によって TypeScript アプリケーションから利用しています。

これにより、以下のメリットがあります：

- エディタの支援（プレビュー、ハイライト）を受けながらコンテンツを執筆できる
- アプリケーションのバンドラ（Webpack, Metro 等）の設定を変更せずに、ゼロランタイムでコンテンツを読み込める
- Web と Mobile で完全に共有できる

## ディレクトリ構造

コンテンツは `packages/content` パッケージで管理されています。

```
packages/content/
├── src/
│   └── patterns/
│       ├── pattern13.md      # コンテンツの実体（Markdown）
│       ├── pattern13.gen.ts  # 自動生成される TypeScript ファイル（編集禁止）
│       └── pattern13.ts      # 公開用エントリポイント
└── scripts/
    └── sync-markdown.ts      # Codegen スクリプト
```

## 開発ワークフロー

### 1. Markdown の編集

`src/patterns/*.md` ファイルを編集します。

### 2. コード生成（Codegen）

変更をアプリケーションに反映させるには、Markdown を TypeScript ファイルに変換する必要があります。

#### ワンショット実行

手動で一度だけ生成する場合：

```bash
pnpm gen:content
```

#### ウォッチモード（推奨）

開発中は、以下のコマンドを実行しておくことで、ファイルの変更を検知して自動的に再生成されます。

```bash
pnpm gen:content:watch
```

ルートディレクトリで実行してください。ターミナルでこのプロセスをバックグラウンド実行しておけば、通常の開発と同じようにホットリロード（HMR）の恩恵を受けられます。

注意: 新しいファイルを追加した場合は、対応する `.ts` ファイル（re-export用）を手動で作成する必要があります。

```typescript
// src/patterns/new-pattern.ts
export { newPatternContent } from "./new-pattern.gen";
```
