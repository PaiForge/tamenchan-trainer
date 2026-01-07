import { describe, it, expect } from "vitest";
import { generateHand } from "./PatternGenerator";
import { normalize } from "./PatternNormalizer";
import { PatternNotSupportedError } from "../errors";
import { PatternId } from "../types";

describe("PatternGenerator", () => {
  describe("generateHand", () => {
    it("生成された手牌が元のパターンIDに正規化されること", () => {
      const patternId: PatternId = "31";

      // Run 100 random generations to cover various possibilities
      for (let i = 0; i < 100; i++) {
        const hand = generateHand(patternId);
        const normalized = normalize(hand);

        // Generated hand must be valid (1-9)
        expect(hand.every((n) => n >= 1 && n <= 9)).toBe(true);

        // Normalized form must match original
        expect(normalized).toBe(patternId);
      }
    });

    it("サポートされていないパターンを正規化しようとした場合にエラーをスローすること", () => {
      // "1112345" is not in SUPPORTED_PATTERNS
      const patternId = "1112345" as PatternId;
      const hand = generateHand(patternId);

      // generateHand works (it just shifts numbers), but normalize should reject it
      expect(() => normalize(hand)).toThrow(PatternNotSupportedError);
    });

    it("無効なパターンID形式の場合にエラーをスローすること", () => {
      expect(() => generateHand("12a" as PatternId)).toThrow();
    });

    it("空のパターンの場合に空配列を返すこと", () => {
      expect(generateHand("" as PatternId)).toEqual([]);
    });
  });

  // Additional check to ensure variety (probabilistic)
  it("（スライドや反転を含む）多様な手牌が生成されること", () => {
    const patternId: PatternId = "31";
    const generated = new Set<string>();

    // 1112 is small enough to have many valid positions.
    // Original: 1112, 2223, ..., 8889 (8 patterns)
    // Mirror (1112 reversed is 2111 -> 8999):
    // 8999 -> 1222 pattern? Wait.
    // 1112 normalized is 1112.
    // Mirror of 1112 is 8999 (sorted).
    // 8999 normalized: Slide->1222. Mirror->(2111)->1112. Min is 1112.
    // So 8999 is a valid generation for 1112.

    // Expected variations:
    // 1112, 2223...8889 (Normal 1112-like)
    // 1222, 2333...8999 (Mirror 1222-like)

    for (let i = 0; i < 200; i++) {
      generated.add(generateHand(patternId).join(""));
    }

    // We expect at least one "Normal-like" (e.g. 1112) and one "Mirror-like" (e.g. 1222)
    // AND one shifted version.
    expect(generated.has("1112")).toBe(true); // Base
    expect(generated.has("2223")).toBe(true); // Shifted
    // Mirror variation check:
    // 1112 -> Mirror -> 9998 -> sorted 8999.
    expect(generated.has("8999")).toBe(true);
  });
});
