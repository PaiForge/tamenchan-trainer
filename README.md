# Tamenchan Trainer (多面張トレーナー)

麻雀の多面張待ち当てトレーニングアプリです。
React Native (Expo) で開発されています。

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

開発サーバーを起動します。

```bash
pnpm start
```

OSごとの起動コマンド:

```bash
# Android
pnpm android

# iOS
pnpm ios

# Web
pnpm web
```
