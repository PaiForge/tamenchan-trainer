import { PatternId } from "@/core/pattern";

/**
 * パターン間の関係性を定義する
 */
export const PATTERN_RELATIONSHIPS: Record<PatternId, { supersets: string[] }> =
  {
    "13": {
      // 313型: 1222333 (1,3,4待ち) など
      // 待ちが増える、あるいは構造的に上位となる形を排除する
      supersets: ["313"],
    },
  };
