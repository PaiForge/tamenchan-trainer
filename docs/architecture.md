# アーキテクチャとディレクトリ構成指針

このプロジェクトでは、以下の技術スタックとディレクトリ構成方針を採用しています。

## 1. Expo Router の採用

ルーティングライブラリとして **Expo Router** を採用しています。
詳細な仕様やルーティングの仕組みについては、公式ドキュメントを参照してください。

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## 2. ディレクトリ構成 (App Router)

`src/app` をルートとした App Router 構成を採用しています。

```
src/
├── app/            # 画面・ルーティング定義
├── components/     # 汎用 UI コンポーネント
└── features/       # ドメインロジック
```

## 3. 実装プラクティス

Expo Router のベストプラクティス（コロケーション等）に従います。

- **Private Folder (`_components`)**:
  画面固有のコンポーネントは、同階層の `_components` ディレクトリに配置します。
  (参照: [Expo Router - Grouping files](https://docs.expo.dev/router/create-pages/#grouping-files))

- **ディレクトリベースのルーティング (`index.tsx`)**:
  `profile/friends.tsx` のようなフラットなファイルではなく、`profile/friends/index.tsx` のように**ディレクトリを切って `index.tsx` を配置する**構成を推奨します。
  これにより、将来的にその画面固有のコンポーネント (`_components`) やレイアウト (`_layout.tsx`) を配置しやすくなります。
