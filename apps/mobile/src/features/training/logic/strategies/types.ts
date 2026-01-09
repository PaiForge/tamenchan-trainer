import { HaiKindId, HaiType } from "@pai-forge/riichi-mahjong";

/**
 * 問題生成時の変換オプション
 *
 * 並行移動（shift）と左右反転（mirror）を明示的に制御する。
 * 指定されていない場合は、ランダムに決定される。
 */
export interface TransformOptions {
  /**
   * 並行移動の量（0-8の範囲）
   *
   * 基本形（1から始まる形）に対して、何段階シフトするか。
   * - 0: 基本形のまま（1222 など）
   * - 1: 1段階上にシフト（2333 など）
   * - n: n段階上にシフト
   *
   * 指定されていない場合は、牌の範囲内でランダムに決定される。
   *
   * @example
   * ```typescript
   * shift: 0  // 1222
   * shift: 1  // 2333
   * shift: 7  // 8999
   * ```
   */
  shift?: number;

  /**
   * 左右反転を適用するか
   *
   * true の場合、10-n の変換を適用して左右対称な形にする。
   * - false: 通常形（1222, 2333 など）
   * - true: 反転形（8999, 7888 など）
   *
   * 指定されていない場合は、50%の確率でランダムに決定される。
   *
   * @example
   * ```typescript
   * mirror: false  // 1222, 2333 など
   * mirror: true   // 8999, 7888 など
   * ```
   */
  mirror?: boolean;
}

/**
 * 問題生成のストラテジーインターフェース
 *
 * パターンごとに、Normal（通常形）、Penchan（辺張形）、Interference（干渉形）の
 * 3種類の問題を生成する戦略を定義する。
 */
export interface GenerationStrategy {
  /**
   * 通常形の問題を生成する
   *
   * 端を避けた位置に配置された形。Pattern 13の場合は3面待ち。
   *
   * @param suit - 対象のスート（萬子/筒子/索子）
   * @param options - 変換オプション（並行移動、左右反転）
   * @returns 生成された牌のHaiKindId配列
   */
  generateNormal(
    suit: HaiType,
    options?: Readonly<TransformOptions>,
  ): HaiKindId[];

  /**
   * 辺張形の問題を生成する
   *
   * 端牌（1 または 9）に配置された形。Pattern 13の場合は2面待ち。
   *
   * @param suit - 対象のスート（萬子/筒子/索子）
   * @param options - 変換オプション（左右反転のみ有効、shiftは自動決定）
   * @returns 生成された牌のHaiKindId配列
   */
  generatePenchan(
    suit: HaiType,
    options?: Readonly<TransformOptions>,
  ): HaiKindId[];

  /**
   * 干渉形の問題を生成する
   *
   * 干渉面子によって待ち牌が物理的に消費される形。
   * Pattern 13の場合は待ちが1-2面に減少。
   *
   * @param suit - 対象のスート（萬子/筒子/索子）
   * @param options - 変換オプション（並行移動、左右反転）
   * @returns 生成された牌のHaiKindId配列
   */
  generateInterference(
    suit: HaiType,
    options?: Readonly<TransformOptions>,
  ): HaiKindId[];
}
