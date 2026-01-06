import { PatternId } from "../types";

/**
 * 正規化されたパターンIDから、実戦形式の手牌（数値配列）を生成する
 *
 * @param patternId 正規化されたパターンID (例: "1112")
 * @returns ランダムにスライド・反転された手牌配列 (例: [2,3,3,3], [7,8,8,8] など)
 */
export function generateHand(patternId: PatternId): number[] {
    if (!patternId) return [];

    // パターン文字列を数値配列に展開
    const baseTiles = patternId.split("").map(Number);
    if (baseTiles.some(isNaN)) {
        throw new Error(`Invalid pattern ID: ${patternId}`);
    }

    // ランダムに反転させるか決定 (50%)
    const useMirror = Math.random() < 0.5;
    let currentTiles = [...baseTiles];

    if (useMirror) {
        currentTiles = currentTiles.map((n) => 10 - n);
    }

    // スライド可能な範囲を計算
    // 現在のタイル構成における最小値と最大値を取得
    const min = Math.min(...currentTiles);
    const max = Math.max(...currentTiles);

    // 1〜9の範囲に収まるためのシフト量の範囲
    // min + shift >= 1  => shift >= 1 - min
    // max + shift <= 9  => shift <= 9 - max
    const minShift = 1 - min;
    const maxShift = 9 - max;

    // 範囲内でランダムなシフト量を決定
    const shift = Math.floor(Math.random() * (maxShift - minShift + 1)) + minShift;

    // シフト適用
    const generatedTiles = currentTiles.map((n) => n + shift);

    // ソートして返す
    return generatedTiles.sort((a, b) => a - b);
}
