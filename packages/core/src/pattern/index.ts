/**
 * Pattern (牌式) モジュール
 *
 * パターン（牌式）に関する型定義、バリデーション、変換ロジックを提供する。
 * このモジュールはアプリケーション全体で使用される横断的なコアドメインモデル。
 *
 * @module core/pattern
 */

// 型定義
export type { PatternId } from "./types";
export { SUPPORTED_PATTERNS } from "./types";

// バリデーション・型ガード
export { isPatternId, validateHaishikiSyntax } from "./validators";
