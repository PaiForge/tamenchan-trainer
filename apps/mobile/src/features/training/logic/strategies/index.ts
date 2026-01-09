import { PatternId } from "@tamenchan-trainer/core";
import { GenerationStrategy } from "./types";
import { Pattern13Strategy } from "./pattern13";

/**
 * パターンIDごとの問題生成ストラテジーのマッピング
 *
 * 新しいパターンを追加する際は、ここに対応するストラテジーを登録する。
 */
export const Strategies: Record<PatternId, GenerationStrategy> = {
  "13": Pattern13Strategy,
};

// Re-export types for convenience
export type { GenerationStrategy, TransformOptions } from "./types";
