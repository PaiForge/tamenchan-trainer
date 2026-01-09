import { PatternId } from "@tamenchan-trainer/core";

/**
 * 指定されたパターンの理想的な（最大の）待ちの数を返す
 *
 * 例: "1112" pattern (1112, 2333, etc.)
 * - 1112: 待ち2種 (2,3)
 * - 2333: 待ち3種 (1,2,4)
 * - 3444: 待ち3種 (2,3,5)
 * - ...
 * 最大の待ちは 3種類 (変則多面待ちとしての最大ポテンシャル)
 *
 * ただしペンチャン判定（辺張）においては、「本来その形が持つべき待ち数」と比較する必要がある。
 * "1112" (端) は2種が正解であり、"2333" (中) は3種が正解。
 * つまり、PatternId だけでなく、生成された具体的な牌姿（の相対的な位置）によって理想値は異なる。
 *
 * 簡易的に、PatternId ごとの「最大」を定義し、それ未満ならペンチャン（または端）と判定する基準として使用する。
 */
export function getIdealWaitCount(patternId: PatternId): number {
  // Currently only "1222" is supported
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (patternId === "13") {
    return 3;
  }
  return 0;
}
