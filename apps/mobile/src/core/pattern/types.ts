/**
 * パターン（牌式）の型定義
 *
 * ユビキタス言語で定義された「牌式（Haishiki）」に基づく型定義。
 * Pattern（パターン）は、正規化された多面待ちの核となる牌の組み合わせを表す。
 */

/**
 * サポートされているパターンIDのリスト
 *
 * 現在サポートされているパターンの牌式文字列。
 * 新しいパターンを追加する際は、ここに追加する。
 *
 * NOTE: Pattern 13 (旧称: Pattern 31, 1112型)
 * ミラー処理削除に伴い、牌式定義を変更しました。
 * 詳細は docs/haishiki-normalization.md を参照してください。
 */
export const SUPPORTED_PATTERNS = ["13"] as const;

/**
 * パターンを一意に識別するID文字列（牌式）
 *
 * 牌式は、正規化された牌の枚数を順に並べた数列フォーマット。
 * - 例: "31" は [1,1,1,2] の形（3枚+1枚）を表す
 * - 各桁は 0-4 の範囲（麻雀牌の枚数制限）
 * - 最小値が1になるよう正規化済み
 * - 左右反転形も考慮して辞書順で小さい方を採用
 *
 * @see docs/ubiquitous-language.md - 牌式の詳細な定義
 */
export type PatternId = (typeof SUPPORTED_PATTERNS)[number];
