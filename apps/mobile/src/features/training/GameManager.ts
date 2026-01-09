import { HaiKind, HaiKindId } from "@pai-forge/riichi-mahjong";
import {
  generateProblem,
  generateProblemSet,
  type GameState,
  type ProblemConfig,
} from "./logic/problem";

// Re-export types and functions from problem module for backward compatibility
export type { GameState, ProblemConfig };
export { generateProblem, generateProblemSet };

/**
 * 牌種IDを回答用の数値 (1-9) に変換する
 * @param hai 牌種ID
 */
export const haiKindToNumber = (hai: HaiKindId): number => {
  if (hai >= HaiKind.ManZu1 && hai <= HaiKind.ManZu9)
    return hai - HaiKind.ManZu1 + 1;
  if (hai >= HaiKind.PinZu1 && hai <= HaiKind.PinZu9)
    return hai - HaiKind.PinZu1 + 1;
  if (hai >= HaiKind.SouZu1 && hai <= HaiKind.SouZu9)
    return hai - HaiKind.SouZu1 + 1;
  return 0;
};

/**
 * Check if the user's selected waits match the correct waits exactly.
 */
export function checkAnswer(
  selectedMachi: readonly HaiKindId[],
  machi: readonly HaiKindId[],
): boolean {
  if (selectedMachi.length !== machi.length) return false;

  const sortedSelected = [...selectedMachi].sort((a, b) => a - b);
  const sortedCorrect = [...machi].sort((a, b) => a - b);

  return sortedSelected.every((val, index) => val === sortedCorrect[index]);
}

/**
 * 手牌を連結したブロックに分割する
 * 数牌は距離1以内（連番・同一）で連結。字牌は同一牌のみ連結。
 * スートが異なる場合は切断。
 */
export function splitIntoBlocks(tehai: readonly HaiKindId[]): HaiKindId[][] {
  const sorted = [...tehai].sort((a, b) => a - b);

  if (sorted.length === 0) return [];

  const blocksRaw: HaiKindId[][] = [];
  let currentBlockRaw: HaiKindId[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    // Check connectivity
    // 1. Same Suit? (Range check)
    // 2. Distance <= 1?

    const prevSuit = getSuit(prev);
    const currSuit = getSuit(curr);

    const prevNum = haiKindToNumber(prev);
    const currNum = haiKindToNumber(curr);

    // 連結条件: スートが同じ かつ (数値差<=1 または 同一牌)
    // ※字牌の場合、数値は関係ないが、getSuitで区別されるか？
    // getSuit implementation separates honors individually? No, usually groups them.
    // If we group honors, "East" and "South" should NOT construct a block.
    // So for honors, we require EXACT ID match.
    // For Suupai, we allow difference <= 1.

    let isConnected = false;
    if (prevSuit < 3 && currSuit < 3) {
      // Both Suupai and same suit
      if (prevSuit === currSuit && currNum - prevNum <= 1) {
        isConnected = true;
      }
    } else {
      // Honors or mixed
      // Only connect if identical ID
      if (prev === curr) {
        isConnected = true;
      }
    }

    if (isConnected) {
      currentBlockRaw.push(curr);
    } else {
      blocksRaw.push(currentBlockRaw);
      currentBlockRaw = [curr];
    }
  }
  blocksRaw.push(currentBlockRaw);
  return blocksRaw;
}

function getSuit(hai: HaiKindId): number {
  if (hai >= HaiKind.ManZu1 && hai <= HaiKind.ManZu9) return 0;
  if (hai >= HaiKind.PinZu1 && hai <= HaiKind.PinZu9) return 1;
  if (hai >= HaiKind.SouZu1 && hai <= HaiKind.SouZu9) return 2;
  return 3; // Treat all honors as suit 3 (logic above handles details)
}
