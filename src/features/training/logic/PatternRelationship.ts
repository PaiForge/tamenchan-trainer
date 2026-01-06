import { PatternId } from "../types";

/**
 * パターン間の関係性を定義する
 */
export const PATTERN_RELATIONSHIPS: Record<PatternId, { supersets: string[] }> = {
    "1112": {
        // "1112" (4枚形) の上位形として "1233334" (7枚形) などを定義
        // ※現時点では PatternId 型に含まれないパターン文字列も許容するために string[] としているが、
        // 将来的に全て型安全にするのが望ましい。
        supersets: ["1233334"]
    }
};
