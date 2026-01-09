import { PatternId, SUPPORTED_PATTERNS } from "./types";

/**
 * 文字列が有効な PatternId であるかを判定する型ガード
 *
 * サポートされているパターンのリストに含まれるかをチェックする。
 * この関数は型ガードとして機能し、TypeScriptの型推論を支援する。
 *
 * @param value - 検証する文字列
 * @returns 有効な PatternId であれば true
 *
 * @example
 * ```typescript
 * const id = "31";
 * if (isPatternId(id)) {
 *   // この中では id は PatternId 型として扱われる
 *   console.log(id); // "31"
 * }
 * ```
 */
export function isPatternId(value: string): value is PatternId {
  return SUPPORTED_PATTERNS.some((p) => p === value);
}

/**
 * 牌式文字列の構文が有効かを検証する
 *
 * 牌式の定義に基づいて、以下をチェック:
 * - 長さが 1-9 の範囲内（数牌は最大9種類）
 * - 各桁が 0-4 の範囲内（麻雀牌は各種4枚まで）
 * - 空文字列でないこと
 *
 * 注意: この関数は構文のみを検証し、サポート状態はチェックしない。
 * サポートされているパターンかどうかは isPatternId() を使用すること。
 *
 * @param value - 検証する牌式文字列
 * @returns 構文が有効であれば true
 *
 * @example
 * ```typescript
 * validateHaishikiSyntax("31");    // true (サポート済み)
 * validateHaishikiSyntax("103");   // true (構文は有効だがサポート外)
 * validateHaishikiSyntax("555");   // false (5は無効な桁)
 * validateHaishikiSyntax("");      // false (空文字列)
 * validateHaishikiSyntax("0123456789"); // false (長すぎる)
 * ```
 */
export function validateHaishikiSyntax(value: string): boolean {
  // 長さチェック: 1-9文字
  if (value.length === 0 || value.length > 9) {
    return false;
  }

  // 各桁が 0-4 の範囲内かチェック
  return /^[0-4]+$/.test(value);
}
