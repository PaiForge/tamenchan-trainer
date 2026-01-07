import { Pai } from "./Pai";
import { describe, it, expect } from "vitest";

describe("Pai Domain Object", () => {
  describe("fromTiles", () => {
    it("should convert correctly (Basic 1112 -> 31)", () => {
      const tiles = [1, 1, 1, 2];
      const pai = Pai.fromTiles(tiles);
      expect(pai.value).toBe("31");
    });

    it("should handle sliding (2223 -> 31)", () => {
      const tiles = [2, 2, 2, 3];
      const pai = Pai.fromTiles(tiles);
      expect(pai.value).toBe("31");
    });

    it("should handle mirroring (8999 -> 31)", () => {
      // 8999 -> mirror (1112) -> slide (1112) -> "31"
      // original (8999) -> slide (1222) -> "13"
      // "1112" < "1222" so "31" is chosen
      const tiles = [8, 9, 9, 9];
      const pai = Pai.fromTiles(tiles);
      expect(pai.value).toBe("31");
    });

    it("should handle mixed order (3222 -> 31)", () => {
      const tiles = [3, 2, 2, 2];
      const pai = Pai.fromTiles(tiles);
      expect(pai.value).toBe("31");
    });

    it("should handle gaps (1333 -> 103)", () => {
      const tiles = [1, 3, 3, 3];
      const pai = Pai.fromTiles(tiles);
      // NOTE: strict validation of supported patterns is not in Pai.fromTiles core logic yet,
      // but it should produce the correct string.
      // "103" is not in SUPPORTED_PATTERNS yet but logic should work.
      expect(pai.value).toBe("301");
    });
  });

  describe("generateHand", () => {
    it("should generate a valid hand that normalizes back to the original ID", () => {
      const pai = Pai.fromId("31");
      for (let i = 0; i < 50; i++) {
        const hand = pai.generateHand();
        const rederivedPai = Pai.fromTiles(hand);
        expect(rederivedPai.value).toBe("31");

        // Check range
        const min = Math.min(...hand);
        const max = Math.max(...hand);
        expect(min).toBeGreaterThanOrEqual(1);
        expect(max).toBeLessThanOrEqual(9);
      }
    });
  });
});
