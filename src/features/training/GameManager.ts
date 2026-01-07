import {
  HaiKind,
  HaiKindId,
  HaiType,
  getUkeire,
} from "@pai-forge/riichi-mahjong";
import { Suupai } from "../../types";
import { PatternId, SUPPORTED_PATTERNS } from "./types";
import { Strategies } from "./logic/GenerationStrategy";

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
    // Default behavior: Random supported pattern
    const patternId =
      SUPPORTED_PATTERNS[Math.floor(Math.random() * SUPPORTED_PATTERNS.length)];
    problemConfig = {
      patternId,
      requireInterference: false,
      requirePenchan: false,
    };
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

  // Strategy Execution
  const strategy = Strategies[problemConfig.patternId];
  let coreTiles: HaiKindId[] = [];

  if (problemConfig.requireInterference) {
    coreTiles = strategy.generateInterference(targetSuit);
  } else if (problemConfig.requirePenchan) {
    coreTiles = strategy.generatePenchan(targetSuit);
  } else {
    coreTiles = strategy.generateNormal(targetSuit);
  }

  // Padding with Honors (Safe, Non-Interfering)
  // Randomize by triplet groups to preserve Mentsu structure
  const honorGroups = [
    [HaiKind.Ton, HaiKind.Ton, HaiKind.Ton],
    [HaiKind.Nan, HaiKind.Nan, HaiKind.Nan],
    [HaiKind.Sha, HaiKind.Sha, HaiKind.Sha],
    [HaiKind.Pei, HaiKind.Pei, HaiKind.Pei],
    [HaiKind.Haku, HaiKind.Haku, HaiKind.Haku],
    [HaiKind.Hatsu, HaiKind.Hatsu, HaiKind.Hatsu],
    [HaiKind.Chun, HaiKind.Chun, HaiKind.Chun],
  ];
  honorGroups.sort(() => Math.random() - 0.5);
  const paddingCandidates = honorGroups.flat();

  const needed = 13 - coreTiles.length;
  // Use what is needed
  const padding = paddingCandidates.slice(0, needed);

  const tehai = [...coreTiles, ...padding].sort((a, b) => a - b);

  return {
    tehai,
    tsumo: null,
    machi: getUkeire({ closed: tehai, exposed: [] }),
    suit: targetSuit,
  };
}

/**
 * 複数の問題を一括生成し、重複を排除しバリエーションを確保する
 */
/**
 * 複数の問題を一括生成し、重複を排除しバリエーションを確保する
 * 10問セットの場合: 干渉1, 辺張2, 通常7 の割合を目指す
 */
export function generateProblemSet(
  count: number,
  _config: Readonly<ProblemConfig>,
): GameState[] {
  const problems: GameState[] = [];
  const generatedTehaiHashes = new Set<string>();

  // Target counts
  let interferenceCount = 0;
  let penchanCount = 0;
  let normalCount = 0;

  if (count >= 10) {
    interferenceCount = Math.floor(count / 10);
    penchanCount = Math.floor(count / 10) * 2;
    normalCount = count - interferenceCount - penchanCount;
  } else {
    // For small counts, prioritize variety if possible, but keep it simple
    normalCount = count;
  }

  const targets = [
    { type: "interference", target: interferenceCount },
    { type: "penchan", target: penchanCount },
    { type: "normal", target: normalCount },
  ];

  for (const { type, target } of targets) {
    let currentTypeCount = 0;
    let attempts = 0;

    // Increase attempt limit significantly for hard-to-generate types (Interference)
    const maxAttempts = Math.max(target * 50, 100);

    while (currentTypeCount < target && attempts < maxAttempts) {
      attempts++;

      // Create specific config for this problem
      // We ignore the passed `config` patternId to ensure variety,
      // picking a random supported pattern each time.
      const patternId =
        SUPPORTED_PATTERNS[
          Math.floor(Math.random() * SUPPORTED_PATTERNS.length)
        ];

      const currentConfig: ProblemConfig = {
        patternId,
        requireInterference: type === "interference",
        requirePenchan: type === "penchan",
      };

      const problem = generateProblem(currentConfig);

      // 重複チェック
      const hash = problem.tehai.join(",");
      if (generatedTehaiHashes.has(hash)) {
        continue;
      }

      // Check if we actually got what we wanted (especially for Interference/Penchan)
      // generateProblem might return a fallback or a normal problem if generation fails.
      // Ideally generateProblem should throw or strict return, but currently it returns fallback.
      // We can check the properties of the generated problem if needed,
      // but for now we trust generateProblem's "Specialized Fallback" or success.

      generatedTehaiHashes.add(hash);
      problems.push(problem);
      currentTypeCount++;
    }
  }

  // Shuffle the problems
  for (let i = problems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [problems[i], problems[j]] = [problems[j], problems[i]];
  }

  return problems;
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
