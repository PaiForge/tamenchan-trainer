/**
 * サポートされているパターンIDのリスト
 */
export const SUPPORTED_PATTERNS = ["31"] as const;

/**
 * パターンを一意に識別するID文字列
 * サポートされているパターンのみを許容する
 */
export type PatternId = (typeof SUPPORTED_PATTERNS)[number];
