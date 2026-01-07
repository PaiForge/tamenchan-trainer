import {
  HaiKind,
  HaiKindId,
  HaiType,
  getUkeire,
} from "@pai-forge/riichi-mahjong";
import { Suupai } from "../../types";
import { MANZU_HAIS, PINZU_HAIS, SOUZU_HAIS } from "../../constants";
import { generateHand } from "./logic/PatternGenerator";
import { PatternId, SUPPORTED_PATTERNS } from "./types";
import { getIdealWaitCount } from "./logic/PatternDetector";

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

export interface GameState {
  readonly tehai: readonly HaiKindId[];
  readonly tsumo: HaiKindId | null; // null for 13 tiles (waiting)
  readonly machi: readonly HaiKindId[];
  readonly suit: Suupai;
}

export interface ProblemConfig {
  patternId: PatternId;
  /** 干渉（待ちが減ること）を必須とするか. Default: false */
  requireInterference?: boolean;
  /** ペンチャン/辺張（本来のパターンより待ちが少ないこと）を必須とするか. Default: false */
  requirePenchan?: boolean;
}

/**
 * チンイツのテンパイ形の出題データを生成する
 * PatternGeneratorを使用して特定のパターンに基づいた問題を生成する
 *
 * @param forceSuit 出題するスート (指定がない場合はランダム)
 */
export function generateProblem(
  config?: Readonly<ProblemConfig> | Suupai,
): GameState {
  // Overload handling or default config
  let problemConfig: ProblemConfig;

  if (!config || typeof config === "string") {
    // Default behavior: Random supported pattern, strict mode
    const patternId =
      SUPPORTED_PATTERNS[Math.floor(Math.random() * SUPPORTED_PATTERNS.length)];
    problemConfig = {
      patternId,
      requireInterference: false,
      requirePenchan: false,
    };
    // If forceSuit is provided (legacy arg), we honor it later
    if (typeof config === "string") {
      // We can't actually store forceSuit in ProblemConfig easily unless we expand it.
      // But the original loop logic handled forceSuit.
      // We'll handle targetSuit logic below.
    }
  } else {
    problemConfig = config;
  }

  // Select suit
  let targetSuit: Suupai = HaiType.Manzu;

  // Honor "string" argument as forceSuit
  if (typeof config === "string") {
    targetSuit = config;
  } else {
    const r = Math.random();
    if (r < 0.33) targetSuit = HaiType.Manzu;
    else if (r < 0.66) targetSuit = HaiType.Pinzu;
    else targetSuit = HaiType.Souzu;
  }

  const haiSet =
    targetSuit === HaiType.Manzu
      ? MANZU_HAIS
      : targetSuit === HaiType.Pinzu
        ? PINZU_HAIS
        : SOUZU_HAIS;

  // All available tiles for random filling (including honors)
  const allGenericTiles: HaiKindId[] = [
    ...MANZU_HAIS,
    ...PINZU_HAIS,
    ...SOUZU_HAIS,
    HaiKind.Ton,
    HaiKind.Nan,
    HaiKind.Sha,
    HaiKind.Pei,
    HaiKind.Haku,
    HaiKind.Hatsu,
    HaiKind.Chun,
  ];

  let attempts = 0;
  while (attempts < 1000) {
    attempts++;

    // 1. Generate Core Pattern
    const coreNumbers = generateHand(problemConfig.patternId);
    const coreTiles = coreNumbers.map((n) => haiSet[n - 1]);

    // 2. Calculate Core Waits (Ideal State with Padding)
    // Pad with isolated honors to reach 13 tiles for exact checking
    const paddingTiles = [
      HaiKind.Ton,
      HaiKind.Ton,
      HaiKind.Ton,
      HaiKind.Nan,
      HaiKind.Nan,
      HaiKind.Nan,
      HaiKind.Sha,
      HaiKind.Sha,
      HaiKind.Sha,
    ];
    // Ensure enough padding (core is usually 4-7 tiles)
    const checkTehai = [...coreTiles, ...paddingTiles].slice(0, 13);

    const coreUkeire = getUkeire({ closed: checkTehai, exposed: [] });
    const coreWaitIds = coreUkeire
      .filter((id) => id >= haiSet[0] && id <= haiSet[8]) // Filter to target suit only
      .sort((a, b) => a - b);

    // Penchan Check (Wait Count)
    const idealCount = getIdealWaitCount(problemConfig.patternId);
    if (idealCount > 0) {
      // requirePenchan=false (Default) -> Only allow Ideal (Max) waits
      if (!problemConfig.requirePenchan && coreWaitIds.length < idealCount) {
        continue;
      }
      // requirePenchan=true -> Only allow Non-Ideal (Penchan/Edge) waits (Strict)
      if (problemConfig.requirePenchan && coreWaitIds.length >= idealCount) {
        continue;
      }
    }

    // 3. Fill Remaining Tiles (Realistic Random)
    let currentTehai = [...coreTiles];
    let validFill = true;

    // Try to add random melds until 13
    while (currentTehai.length < 13) {
      const needed = 13 - currentTehai.length;
      if (needed < 3) {
        validFill = false;
        break;
      }

      // If requiring interference, bias towards the target suit to increase collision chance
      const biasSuit = problemConfig.requireInterference
        ? targetSuit
        : undefined;
      const meld = generateRealRandomMeld(allGenericTiles, biasSuit);
      // Validation: Count check (using temp array)
      const tempTehai = [...currentTehai, ...meld];
      if (!validateTileCount(tempTehai)) {
        validFill = false;
        break;
      }
      currentTehai = tempTehai;
    }

    if (!validFill) continue;

    // 4. Strict Simulation Verification
    const actualUkeire = getUkeire({ closed: currentTehai, exposed: [] });

    // Compare Sets
    const coreSet = new Set(coreWaitIds);
    const actualSet = new Set(actualUkeire);

    const missing = coreWaitIds.filter((x) => !actualSet.has(x));
    const extras = actualUkeire.filter((x) => !coreSet.has(x));

    const isInterference = missing.length > 0;
    const isSuperset = extras.length > 0;

    if (isSuperset) {
      // Generally reject supersets (wait expansion) to keep pattern focus
      // But if requiring interference (blocking waits), we allow expansion IF we blocked something
      if (problemConfig.requireInterference && isInterference) {
        // Allowed: Complex transformation (some blocked, some added)
      } else {
        continue;
      }
    }

    if (isInterference) {
      // requireInterference=false (Default) -> Ban interference
      if (!problemConfig.requireInterference) {
        continue;
      }
    } else {
      // requireInterference=true -> Require interference (Must have missing waits)
      if (problemConfig.requireInterference) {
        continue;
      }
    }

    // Found a valid problem!
    return {
      tehai: currentTehai.sort((a, b) => a - b),
      tsumo: null,
      machi: actualUkeire,
      suit: targetSuit,
    };
  }

  // Fallback logic

  // Default valid fallback (6667 + Honors)
  let fallbackTehai: HaiKindId[] = [
    haiSet[5],
    haiSet[5],
    haiSet[5],
    haiSet[6],
    HaiKind.Ton,
    HaiKind.Ton,
    HaiKind.Ton,
    HaiKind.Nan,
    HaiKind.Nan,
    HaiKind.Nan,
    HaiKind.Sha,
    HaiKind.Sha,
    HaiKind.Sha,
  ];

  // Specialized Fallback for Interference (Guarantee valid return)
  if (problemConfig.requireInterference) {
    // Construct 2223 (Manzu) + 444 (Manzu) + Honors
    // This is a known interference pattern (2223 waits 1,3,4 -> +444 waits 2,5,7)
    // Adjust suit based on targetSuit
    const t1 = haiSet[1]; // 2
    const t2 = haiSet[2]; // 3
    const t3 = haiSet[3]; // 4
    // 2223
    const core = [t1, t1, t1, t2];
    // 444
    const inject = [t3, t3, t3];

    fallbackTehai = [
      ...core,
      ...inject,
      HaiKind.Ton,
      HaiKind.Ton,
      HaiKind.Ton,
      HaiKind.Nan,
      HaiKind.Nan,
      HaiKind.Nan,
    ];
  }
  // Specialized Fallback for Penchan (AllowPenchan=true)
  else if (problemConfig.requirePenchan) {
    // 1112 + Honors
    const t1 = haiSet[0];
    const t2 = haiSet[1];
    fallbackTehai = [
      t1,
      t1,
      t1,
      t2,
      HaiKind.Ton,
      HaiKind.Ton,
      HaiKind.Ton,
      HaiKind.Nan,
      HaiKind.Nan,
      HaiKind.Nan,
      HaiKind.Sha,
      HaiKind.Sha,
      HaiKind.Sha,
    ];
  }

  return {
    tehai: fallbackTehai.sort((a, b) => a - b),
    tsumo: null,
    machi: getUkeire({ closed: fallbackTehai, exposed: [] }),
    suit: targetSuit,
  };
}

/**
 * リアルなランダム面子を生成する
 * 全種類の牌から選ぶ
 * @param biasSuit 干渉を狙う場合など、特定のスートを優先的に選ぶ
 */
function generateRealRandomMeld(
  allTiles: readonly HaiKindId[],
  biasSuit?: Suupai,
): HaiKindId[] {
  // 30% Honor Koutsu, 35% Suupai Koutsu, 35% Suupai Shuntsu
  // If biasSuit is present, increase probability of Suupai matching biasSuit

  let r = Math.random();

  // Bias logic: If biasSuit is set, significantly reduce Honor rate and force suit
  if (biasSuit) {
    // 10% Honor, 90% Suupai (of biasSuit)
    if (r < 0.1) {
      // Honor path
    } else {
      // Force Suupai path
      r = 0.5; // Ensure we go to else branch below
    }
  }

  if (r < 0.3 && !biasSuit) {
    // Disable high honor rate if biased
    // Honor Koutsu
    const honorTiles = [
      HaiKind.Ton,
      HaiKind.Nan,
      HaiKind.Sha,
      HaiKind.Pei,
      HaiKind.Haku,
      HaiKind.Hatsu,
      HaiKind.Chun,
    ];
    const t = honorTiles[Math.floor(Math.random() * honorTiles.length)];
    return [t, t, t];
  } else {
    // Suupai
    // Pick a suit
    let baseSet = MANZU_HAIS;

    if (biasSuit) {
      switch (biasSuit) {
        case HaiType.Manzu:
          baseSet = MANZU_HAIS;
          break;
        case HaiType.Pinzu:
          baseSet = PINZU_HAIS;
          break;
        case HaiType.Souzu:
          baseSet = SOUZU_HAIS;
          break;
      }
    } else {
      const suitType = Math.random();
      if (suitType < 0.33) baseSet = PINZU_HAIS;
      else if (suitType < 0.66) baseSet = SOUZU_HAIS;
    }

    if (r < 0.65) {
      // Suupai Koutsu
      const idx = Math.floor(Math.random() * 9);
      const t = baseSet[idx];
      return [t, t, t];
    } else {
      // Suupai Shuntsu
      const idx = Math.floor(Math.random() * 7);
      return [baseSet[idx], baseSet[idx + 1], baseSet[idx + 2]];
    }
  }
}

/**
 * 手牌の枚数制限（同種牌4枚以下）を検証する
 * TODO: このチェックは本来 riichi-mahjong 側で行うべき機能です
 */
function validateTileCount(tehai: readonly HaiKindId[]): boolean {
  const counts = new Map<HaiKindId, number>();
  for (const tile of tehai) {
    const c = counts.get(tile) ?? 0;
    if (c >= 4) return false;
    counts.set(tile, c + 1);
  }
  return true;
}

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
