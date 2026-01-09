import {
  HaiKindId,
  HaiType,
  HaiKind,
  getUkeire,
} from "@pai-forge/riichi-mahjong";
import { PatternId, SUPPORTED_PATTERNS, Suupai } from "@tamenchan-trainer/core";
import { Strategies, TransformOptions } from "./strategies";

/**
 * ゲーム状態を表すインターフェース
 */
export interface GameState {
  readonly tehai: readonly HaiKindId[];
  readonly tsumo: HaiKindId | null;
  readonly machi: readonly HaiKindId[];
  readonly suit: Suupai;
}

/**
 * 問題生成の設定
 */
export interface ProblemConfig {
  /** パターンID（牌式） */
  patternId: PatternId;

  /** 並行移動の量（0-8の範囲）。指定なしでランダム */
  shift?: number;

  /** 左右反転を適用するか。指定なしでランダム */
  mirror?: boolean;

  /** 干渉（待ちが減ること）を必須とするか */
  requireInterference?: boolean;

  /** ペンチャン/辺張（端による待ち減少）を必須とするか */
  requirePenchan?: boolean;
}

/**
 * チンイツのテンパイ形の出題データを生成する
 *
 * PatternGeneratorを使用して特定のパターンに基づいた問題を生成する。
 * 並行移動（shift）と左右反転（mirror）を明示的に制御できる。
 *
 * @param config - 問題生成の設定
 * @param forceSuit - 出題するスート（指定がない場合はランダム）
 * @returns 生成された問題（GameState）
 *
 * @example
 * ```typescript
 * // ランダムな Pattern 13 の問題
 * generateProblem({ patternId: "13" });
 *
 * // 明示的な並行移動
 * generateProblem({ patternId: "13", shift: 3 }); // 4555
 *
 * // 左右反転を強制
 * generateProblem({ patternId: "13", mirror: true }); // 8999 側
 *
 * // 並行移動 AND 左右反転
 * generateProblem({ patternId: "13", shift: 2, mirror: true }); // 6777
 *
 * // 干渉形
 * generateProblem({ patternId: "13", requireInterference: true });
 * ```
 */
export function generateProblem(
  config?: Readonly<Partial<ProblemConfig>>,
  forceSuit?: Suupai,
): GameState {
  // デフォルト設定
  const problemConfig: ProblemConfig = {
    patternId:
      config?.patternId ??
      SUPPORTED_PATTERNS[Math.floor(Math.random() * SUPPORTED_PATTERNS.length)],
    shift: config?.shift,
    mirror: config?.mirror,
    requireInterference: config?.requireInterference ?? false,
    requirePenchan: config?.requirePenchan ?? false,
  };

  // スートの選択
  let targetSuit: Suupai;
  if (forceSuit) {
    targetSuit = forceSuit;
  } else {
    const r = Math.random();
    if (r < 0.33) targetSuit = HaiType.Manzu;
    else if (r < 0.66) targetSuit = HaiType.Pinzu;
    else targetSuit = HaiType.Souzu;
  }

  // TransformOptions の構築
  const transformOptions: TransformOptions = {
    shift: problemConfig.shift,
    mirror: problemConfig.mirror,
  };

  // ストラテジーの実行
  const strategy = Strategies[problemConfig.patternId];
  let coreTiles: HaiKindId[] = [];

  if (problemConfig.requireInterference) {
    coreTiles = strategy.generateInterference(targetSuit, transformOptions);
  } else if (problemConfig.requirePenchan) {
    coreTiles = strategy.generatePenchan(targetSuit, transformOptions);
  } else {
    coreTiles = strategy.generateNormal(targetSuit, transformOptions);
  }

  // 字牌でパディング（安全、干渉なし）
  // 面子構造を保つため、刻子グループ単位でランダム化
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
 *
 * 10問セットの場合: 干渉1, 辺張2, 通常7 の割合を目指す
 *
 * @param count - 生成する問題数
 * @param config - 基本設定（patternIdなど）
 * @returns 生成された問題の配列
 */
export function generateProblemSet(
  count: number,
  config: Readonly<Partial<ProblemConfig>>,
): GameState[] {
  const problems: GameState[] = [];
  const generatedTehaiHashes = new Set<string>();

  // 目標数の計算
  let interferenceCount = 0;
  let penchanCount = 0;
  let normalCount = 0;

  if (count >= 10) {
    interferenceCount = Math.floor(count / 10);
    penchanCount = Math.floor(count / 10) * 2;
    normalCount = count - interferenceCount - penchanCount;
  } else {
    // 少数の場合は全て通常形
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

    // 試行回数の上限（干渉形は生成が難しいため多めに）
    const maxAttempts = Math.max(target * 50, 100);

    while (currentTypeCount < target && attempts < maxAttempts) {
      attempts++;

      // 各問題ごとにランダムなパターンを選択（バリエーション確保）
      const patternId =
        config.patternId ??
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

      generatedTehaiHashes.add(hash);
      problems.push(problem);
      currentTypeCount++;
    }
  }

  // シャッフル
  for (let i = problems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [problems[i], problems[j]] = [problems[j], problems[i]];
  }

  return problems;
}
