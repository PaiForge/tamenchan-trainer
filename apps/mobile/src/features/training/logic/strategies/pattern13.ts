import { HaiKindId, HaiType } from "@pai-forge/riichi-mahjong";
import { GenerationStrategy, TransformOptions } from "./types";

// ローカル定数: スート別の牌ID配列
const MANZU_HAIS: readonly HaiKindId[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const PINZU_HAIS: readonly HaiKindId[] = [9, 10, 11, 12, 13, 14, 15, 16, 17];
const SOUZU_HAIS: readonly HaiKindId[] = [18, 19, 20, 21, 22, 23, 24, 25, 26];

/**
 * スートに対応する牌IDの配列を取得する
 */
function getSuitTiles(suit: HaiType): readonly HaiKindId[] {
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

/**
 * 変換オプションを適用してタイル配列を生成する
 *
 * @param baseTiles - 基本形のタイル（1から始まる相対的な値）
 * @param tiles - 実際のスートの牌ID配列
 * @param options - 変換オプション
 * @returns 変換後の牌ID配列
 */
function applyTransform(
  baseTiles: readonly number[],
  tiles: readonly HaiKindId[],
  options?: Readonly<TransformOptions>,
): HaiKindId[] {
  let currentTiles = [...baseTiles];

  // ミラー（左右反転）の適用
  const useMirror = options?.mirror ?? Math.random() < 0.5;
  if (useMirror) {
    currentTiles = currentTiles.map((n) => 10 - n).sort((a, b) => a - b);
  }

  // スライド（並行移動）の計算
  const min = Math.min(...currentTiles);
  const max = Math.max(...currentTiles);
  const minShift = 1 - min;
  const maxShift = 9 - max;

  let shift: number;
  if (options?.shift !== undefined) {
    // 明示的に指定された場合、範囲チェック
    shift = Math.max(minShift, Math.min(maxShift, options.shift));
  } else {
    // ランダムに決定
    shift = Math.floor(Math.random() * (maxShift - minShift + 1)) + minShift;
  }

  // スライドを適用
  const shiftedTiles = currentTiles.map((n) => n + shift);

  // HaiKindIdに変換して返す
  return shiftedTiles.map((n) => tiles[n - 1]);
}

/**
 * Pattern 13 (1222型) の問題生成ストラテジー
 *
 * 牌式 "13" に対応する問題を生成する。
 * - 基本形: 1222 (単独牌1枚 + 暗刻3枚)
 * - 変換: 並行移動、左右反転
 * - バリエーション: Normal（3面待ち）、Penchan（2面待ち）、Interference（干渉）
 */
export const Pattern13Strategy: GenerationStrategy = {
  /**
   * Pattern 13 (1222)
   * Target: Normal (3面待ち)
   * Strategy: 端を避けた位置（2333 〜 6777）に配置
   *
   * 2333 の場合、待ち: 1萬、2萬、4萬 (3面待ち)
   *
   * NOTE: mirror は明示的に指定されない限り false にする。
   * これにより、端牌（1222, 8999）を避け、常に3面待ちが保証される。
   */
  generateNormal: (suit: HaiType, options?: Readonly<TransformOptions>) => {
    const tiles = getSuitTiles(suit);

    // 基本形: 1222
    const baseTiles = [1, 2, 2, 2];

    // shift範囲を1-5に制限（2333 〜 6777）
    // この範囲なら両側に余裕があり、3面待ちが保証される
    let shift: number;
    if (options?.shift !== undefined) {
      // 指定された場合は、1-5の範囲にクランプ
      shift = Math.max(1, Math.min(5, options.shift));
    } else {
      // ランダムの場合は1-5
      shift = Math.floor(Math.random() * 5) + 1;
    }

    const effectiveOptions: TransformOptions = {
      mirror: false, // Normal では mirror を使用しない
      ...options, // ユーザー指定がある場合は上書き
      shift, // shift は常に上記で決定した値を使用
    };

    return applyTransform(baseTiles, tiles, effectiveOptions);
  },

  /**
   * Pattern 13 (1222)
   * Target: Penchan (辺張形、2面待ち)
   * Strategy: 端牌（1222 または 8999）に配置
   *
   * 1222 の場合、待ち: 2筒（辺張）、3筒（単騎） (2面待ち)
   * 8999 の場合、待ち: 7萬（辺張）、8萬（単騎） (2面待ち)
   */
  generatePenchan: (suit: HaiType, options?: Readonly<TransformOptions>) => {
    const tiles = getSuitTiles(suit);

    // 端を選択: 1222 (lower) または 8999 (upper)
    // options.mirror で明示的に指定されていなければランダム
    const useMirror = options?.mirror ?? Math.random() < 0.5;

    let baseTiles: number[];
    if (useMirror) {
      // 8999: 反転形（upperエッジ）
      baseTiles = [8, 9, 9, 9];
    } else {
      // 1222: 通常形（lowerエッジ）
      baseTiles = [1, 2, 2, 2];
    }

    // Penchan の場合、shift は自動的に決定される（端に固定）ので、
    // options.shift は無視する
    return baseTiles.map((n) => tiles[n - 1]);
  },

  /**
   * Pattern 13 (1222)
   * Target: Interference (干渉形、待ち減少)
   * Strategy: 12224 のように、コアに隣接する牌を追加して干渉を起こす
   *
   * 12224 の場合:
   * - 元の 1222 は 1萬、2萬、3萬 待ち
   * - 4萬 が加わることで 2-4 の嵌張が形成され、3萬のみ待ち (1面待ち)
   */
  generateInterference: (
    suit: HaiType,
    options?: Readonly<TransformOptions>,
  ) => {
    const tiles = getSuitTiles(suit);

    // 基本形: [1,2,2,2,4] (干渉面子として4を追加)
    // shiftは 0-5 の範囲（12224 ... 67779）
    const baseTiles = [1, 2, 2, 2, 4];

    // optionsでshiftが指定されていない場合は、0-5の範囲でランダム
    const effectiveOptions: TransformOptions = {
      ...options,
      shift: options?.shift ?? Math.floor(Math.random() * 6),
    };

    return applyTransform(baseTiles, tiles, effectiveOptions);
  },
};
