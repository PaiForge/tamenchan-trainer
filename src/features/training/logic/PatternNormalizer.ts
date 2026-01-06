import { PatternNotSupportedError } from "../errors";
import { PatternId, SUPPORTED_PATTERNS } from "../types";

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
export function normalize(tiles: number[]): PatternId {
    if (tiles.length === 0) {
        throw new PatternNotSupportedError("");
    }

    // 1. 基本的な整形（ソート）
    const sorted = [...tiles].sort((a, b) => a - b);

    // 2. そのままスライドした形 (Original Slide)
    const originalSlide = slideToOne(sorted);
    const originalKey = originalSlide.join("");

    // 3. 反転して整形した形 (Mirrored)
    // 10 - n で反転 (1->9, 2->8, ..., 9->1)
    const mirrored = sorted.map((n) => 10 - n).sort((a, b) => a - b);

    // 4. 反転形をスライド (Mirrored Slide)
    const mirroredSlide = slideToOne(mirrored);
    const mirroredKey = mirroredSlide.join("");

    // 5. 辞書順で小さい方を採用
    const normalizedKey = originalKey < mirroredKey ? originalKey : mirroredKey;

    if (!isSupportedPattern(normalizedKey)) {
        throw new PatternNotSupportedError(normalizedKey);
    }

    return normalizedKey;
}

function isSupportedPattern(pattern: string): pattern is PatternId {
    return (SUPPORTED_PATTERNS as readonly string[]).includes(pattern);
}

/**
 * 最小値が1になるように全体をシフトするヘルパー関数
 */
function slideToOne(tiles: number[]): number[] {
    if (tiles.length === 0) return [];
    const min = tiles[0];
    return tiles.map((n) => n - min + 1);
}
