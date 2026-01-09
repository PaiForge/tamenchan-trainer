import { HaiType } from "@pai-forge/riichi-mahjong";

// Re-define Suupai since it's not exported from the package index
export type Suupai =
  | typeof HaiType.Manzu
  | typeof HaiType.Pinzu
  | typeof HaiType.Souzu;

// Re-export Pattern types from core module
export type { PatternId } from "./core/pattern";
