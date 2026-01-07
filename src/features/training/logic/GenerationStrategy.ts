import { HaiKindId, HaiType } from "@pai-forge/riichi-mahjong";
import { PatternId } from "../types";
// Local constants
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const MANZU_HAIS = Array.from({ length: 9 }, (_, i) => i + 0) as HaiKindId[];
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const PINZU_HAIS = Array.from({ length: 9 }, (_, i) => i + 9) as HaiKindId[];
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const SOUZU_HAIS = Array.from({ length: 9 }, (_, i) => i + 18) as HaiKindId[];

function getSuitTiles(suit: HaiType): HaiKindId[] {
  switch (suit) {
    case HaiType.Manzu:
      return MANZU_HAIS;
    case HaiType.Pinzu:
      return PINZU_HAIS;
    case HaiType.Souzu:
      return SOUZU_HAIS;
    default:
      return MANZU_HAIS;
  }
}

export interface GenerationStrategy {
  generateInterference(suit: HaiType): HaiKindId[];
  generatePenchan(suit: HaiType): HaiKindId[];
  generateNormal(suit: HaiType): HaiKindId[];
}

const Pattern31Strategy: GenerationStrategy = {
  /**
   * Pattern 31 (1112)
   * Target: Interference (Wait count reduced to 1)
   * Strategy: 1112 + 4 -> 11124 (Kanchan)
   * Original 1112 waits 2,3.
   * 11124 (111 + 24) waits 3 only.
   */
  generateInterference: (suit: HaiType) => {
    const tiles = getSuitTiles(suit);
    // 11124 is 5 tiles. (Indices 0, 1, 3)
    // Slide 0..5 (11124 ... 66679)
    const slide = Math.floor(Math.random() * 6); // 0-5

    const t0 = tiles[0 + slide];
    const t1 = tiles[1 + slide];
    const t3 = tiles[3 + slide];

    return [t0, t0, t0, t1, t3];
  },

  /**
   * Pattern 31 (1112)
   * Target: Penchan (Edge wait)
   * Strategy: 1112 (Lower Edge) or 8999 (Upper Edge)
   * 1112 waits 2, 3. (12 waits 3 -> Penchan. 2 waits 2 -> Tanki).
   * 8999 waits 7, 8. (89 waits 7 -> Penchan. 8 waits 8 -> Tanki).
   * Other slides like 2223 wait 1, 4 (Ryanmen).
   */
  generatePenchan: (suit: HaiType) => {
    const tiles = getSuitTiles(suit);
    const isLower = Math.random() < 0.5;

    if (isLower) {
      // 1112
      const t1 = tiles[0];
      const t2 = tiles[1];
      return [t1, t1, t1, t2];
    } else {
      // 8999
      const t8 = tiles[7];
      const t9 = tiles[8];
      return [t8, t9, t9, t9];
    }
  },

  /**
   * Pattern 31 (1112)
   * Target: Normal (Ryanmen / standard)
   * Strategy: Avoid edges.
   * 2223 ... 7778.
   * Indices: 1..7 (for the triplet).
   * Actually 2223 is ryanmen.
   * 7778 is ryanmen.
   * Range 1..6 is safer to avoid 8999 (Edge).
   * 2223 (start 1) ... 7778 (start 6).
   */
  generateNormal: (suit: HaiType) => {
    const tiles = getSuitTiles(suit);
    // Slide 1..6
    const slide = Math.floor(Math.random() * 6) + 1; // 1-6

    const tA = tiles[slide];
    const tB = tiles[slide + 1];

    return [tA, tA, tA, tB];
  },
};

export const Strategies: Record<PatternId, GenerationStrategy> = {
  "31": Pattern31Strategy,
};
