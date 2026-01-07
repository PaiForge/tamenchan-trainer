import { PatternNotSupportedError } from "../errors";
import { PatternId, SUPPORTED_PATTERNS } from "../types";
import { Pai } from "./Pai";

/**
 * 手牌のパターンを正規化するロジック
 */

/**
 * 手牌の構成ハイ（数字配列）を正規化されたパターンIDに変換する。
 *
 * 正規化のルール:
 * 1. スライド: 最小の数字が1になるように全体をシフトする。
 * 2. ミラー: 1と9を反転（10-n）させた形も考慮する。
 * 3. 選択: スライド形とミラー形のうち、辞書順（文字列として）で小さい方を正規IDとする。
 *
 * @param tiles 萬子・筒子・索子の区別なく、1-9の数値の配列として渡す
 * @returns 正規化されたパターンID文字列
 *
 * @example
 * // 2333p (2,3,3,3) -> "1112"
 * // 8999s (8,9,9,9) -> "1112" (反転・正規化により同一視)
 */
export function normalize(tiles: readonly number[]): PatternId {
  if (tiles.length === 0) {
    throw new PatternNotSupportedError("");
  }

  const pai = Pai.fromTiles(tiles);
  const patternId = pai.value;

  if (!isSupportedPattern(patternId)) {
    throw new PatternNotSupportedError(patternId);
  }

  return patternId;
}

function isSupportedPattern(pattern: string): pattern is PatternId {
  return SUPPORTED_PATTERNS.some((p) => p === pattern);
}
