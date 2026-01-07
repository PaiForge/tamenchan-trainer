import { PatternId } from "../types";
import { Pai } from "./Pai";

/**
 * 正規化されたパターンIDから、実戦形式の手牌（数値配列）を生成する
 *
 * @param patternId 正規化されたパターンID (例: "1112")
 * @returns ランダムにスライド・反転された手牌配列 (例: [2,3,3,3], [7,8,8,8] など)
 */
export function generateHand(patternId: PatternId): number[] {
  return Pai.fromId(patternId).generateHand();
}
