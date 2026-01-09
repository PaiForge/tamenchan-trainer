# Tamenchan Trainer (多面張トレーナー)

麻雀の多面張待ち当てトレーニングアプリです。
React Native (Expo) で開発されています。

## プロジェクト構成

本プロジェクトは [Turborepo](https://turbo.build/repo) を使用したモノレポ構成になっています。

```
tamenchan-trainer/
├── apps/
│   └── mobile/          # React Native (Expo) モバイルアプリ
├── packages/            # 共有パッケージ（将来追加予定）
└── docs/               # ドキュメント
```

## 前提条件 (Prerequisites)

### Node.js (Volta)

本プロジェクトでは [Volta](https://volta.sh/) を使用して Node.js のバージョンを管理しています。
`package.json` にバージョンが固定されています (Node v24.12.0)。

Volta をインストール済みであれば、プロジェクトディレクトリに移動すると自動的に適切なバージョンの Node.js が選択されます。
まだ当該バージョンがマシンにない場合は、自動的にダウンロードされるか、以下のコマンドで手動インストールできます：

```bash
volta install node@24.12.0
```

### パッケージマネージャー (pnpm)

パッケージマネージャーとして [pnpm](https://pnpm.io/ja/) を使用しています。

```bash
# pnpmが入っていない場合
volta install pnpm
```

## インストール (Installation)

依存パッケージをインストールします。

```bash
pnpm install
```

## 実行 (Run)

### 開発サーバー起動

開発サーバーを起動します（Turborepo経由で実行されます）。

```bash
# 開発サーバー起動
pnpm dev
# または
pnpm start
```

### プラットフォーム別起動

OSごとの起動コマンド:

```bash
# Android
pnpm android

# iOS
pnpm ios

# Web
pnpm web
```

### 開発用コマンド

```bash
# リント実行
pnpm lint

# リント自動修正
pnpm lint:fix

# 型チェック
pnpm typecheck

# テスト実行
pnpm test

# コードフォーマット
pnpm format
```

> **Note:** すべてのコマンドはTurborepoによって管理され、適切なキャッシュと並列実行が行われます。
