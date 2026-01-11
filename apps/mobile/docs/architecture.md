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
├── core/           # 横断的なコアドメインモデル
│   └── pattern/    # パターン（牌式）の型定義とロジック
├── features/       # 機能別ドメインロジック
└── content/        # 表示用コンテンツ（解説テキストなど）
```

### core/ ディレクトリ

アプリケーション全体で使用される横断的なコアドメインモデルを配置します。

- `core/pattern/`: パターン（牌式）に関する型定義、バリデーション、変換ロジック
  - `types.ts`: PatternId, SUPPORTED_PATTERNS の定義
  - `validators.ts`: 型ガード、構文バリデーション
  - `haishiki.ts`: 牌式の正規化・変換ロジック（純粋関数）
  - `index.ts`: 公開APIのre-export

将来的に、`core/tehai/`, `core/machi/` などを追加する可能性があります。

## 3. 実装プラクティス

Expo Router のベストプラクティス（コロケーション等）に従います。

- **Private Folder (`_components`)**:
  画面固有のコンポーネントは、同階層の `_components` ディレクトリに配置します。
  (参照: [Expo Router - Grouping files](https://docs.expo.dev/router/create-pages/#grouping-files))

- **ディレクトリベースのルーティング (`index.tsx`)**:
  `profile/friends.tsx` のようなフラットなファイルではなく、`profile/friends/index.tsx` のように**ディレクトリを切って `index.tsx` を配置する**構成を推奨します。
  これにより、将来的にその画面固有のコンポーネント (`_components`) やレイアウト (`_layout.tsx`) を配置しやすくなります。

## 4. パスエイリアス

TypeScript と Vitest で `@` エイリアスを使用して `src/` ディレクトリを参照できます。

```typescript
import { PatternId } from "@/core/pattern";
import { Suupai } from "@/types";
```

設定ファイル:

- `tsconfig.json`: `paths` に `@/*` を定義
- `vitest.config.ts`: `resolve.alias` に `@` を定義
