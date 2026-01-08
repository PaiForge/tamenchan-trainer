import { describe, it, expect } from "vitest";
import { isPatternId, validateHaishikiSyntax } from "./validators";

describe("validators", () => {
  describe("isPatternId", () => {
    describe("有効なPatternId", () => {
      it("サポートされているパターン '13' を認識する", () => {
        const result = isPatternId("13");
        expect(result).toBe(true);
      });

      it("型ガードとして機能し、型推論を支援する", () => {
        const value = "13";
        if (isPatternId(value)) {
          // この中では value は PatternId 型として扱われる
          // TypeScript の型システムでこれが保証される
          const patternId: "13" = value; // 型エラーが出ないことを確認
          expect(patternId).toBe("13");
        }
      });
    });

    describe("無効なPatternId", () => {
      it("サポートされていないパターン '103' を拒否する", () => {
        const result = isPatternId("103");
        expect(result).toBe(false);
      });

      it("サポートされていないパターン '313' を拒否する", () => {
        const result = isPatternId("313");
        expect(result).toBe(false);
      });

      it("空文字列を拒否する", () => {
        const result = isPatternId("");
        expect(result).toBe(false);
      });

      it("無効な文字を含む文字列を拒否する", () => {
        const result = isPatternId("31a");
        expect(result).toBe(false);
      });

      it("ランダムな文字列を拒否する", () => {
        const result = isPatternId("invalid");
        expect(result).toBe(false);
      });
    });
  });

  describe("validateHaishikiSyntax", () => {
    describe("有効な牌式構文", () => {
      it("サポート済みパターン '13' を受け入れる", () => {
        const result = validateHaishikiSyntax("13");
        expect(result).toBe(true);
      });

      it("構文は有効だがサポート外のパターン '103' を受け入れる", () => {
        // 構文バリデーションはサポート状態をチェックしない
        const result = validateHaishikiSyntax("103");
        expect(result).toBe(true);
      });

      it("1桁の牌式を受け入れる", () => {
        const result = validateHaishikiSyntax("4");
        expect(result).toBe(true);
      });

      it("9桁（最大長）の牌式を受け入れる", () => {
        const result = validateHaishikiSyntax("123456789");
        expect(result).toBe(false); // 各桁は0-4なので、567は無効
      });

      it("9桁（最大長）で有効な牌式を受け入れる", () => {
        const result = validateHaishikiSyntax("012340123");
        expect(result).toBe(true);
      });

      it("0を含む牌式を受け入れる（ギャップ表現）", () => {
        const result = validateHaishikiSyntax("301");
        expect(result).toBe(true);
      });

      it("全て0の牌式を受け入れる（エッジケース）", () => {
        const result = validateHaishikiSyntax("000");
        expect(result).toBe(true);
      });

      it("全て4の牌式を受け入れる（上限値）", () => {
        const result = validateHaishikiSyntax("444");
        expect(result).toBe(true);
      });
    });

    describe("無効な牌式構文", () => {
      it("5を含む牌式を拒否する（麻雀牌は各種4枚まで）", () => {
        const result = validateHaishikiSyntax("555");
        expect(result).toBe(false);
      });

      it("空文字列を拒否する", () => {
        const result = validateHaishikiSyntax("");
        expect(result).toBe(false);
      });

      it("10桁（長すぎる）の牌式を拒否する", () => {
        const result = validateHaishikiSyntax("0123456789");
        expect(result).toBe(false);
      });

      it("負の数を含む牌式を拒否する", () => {
        const result = validateHaishikiSyntax("3-1");
        expect(result).toBe(false);
      });

      it("文字を含む牌式を拒否する", () => {
        const result = validateHaishikiSyntax("31a");
        expect(result).toBe(false);
      });

      it("空白を含む牌式を拒否する", () => {
        const result = validateHaishikiSyntax("3 1");
        expect(result).toBe(false);
      });

      it("特殊文字を含む牌式を拒否する", () => {
        const result = validateHaishikiSyntax("3!1");
        expect(result).toBe(false);
      });

      it("小数点を含む牌式を拒否する", () => {
        const result = validateHaishikiSyntax("3.1");
        expect(result).toBe(false);
      });
    });

    describe("境界値テスト", () => {
      it("1桁（最小長）を受け入れる", () => {
        expect(validateHaishikiSyntax("0")).toBe(true);
        expect(validateHaishikiSyntax("1")).toBe(true);
        expect(validateHaishikiSyntax("4")).toBe(true);
      });

      it("各桁の境界値をテストする", () => {
        expect(validateHaishikiSyntax("0")).toBe(true); // 最小値
        expect(validateHaishikiSyntax("4")).toBe(true); // 最大値
        expect(validateHaishikiSyntax("5")).toBe(false); // 最大値+1（無効）
      });

      it("長さの境界値をテストする", () => {
        expect(validateHaishikiSyntax("")).toBe(false); // 0桁（無効）
        expect(validateHaishikiSyntax("1")).toBe(true); // 1桁（有効）
        expect(validateHaishikiSyntax("123456789")).toBe(false); // 9桁だが値が無効
        expect(validateHaishikiSyntax("012340123")).toBe(true); // 9桁（有効）
        expect(validateHaishikiSyntax("0123401234")).toBe(false); // 10桁（無効）
      });
    });

    describe("実際のユースケース", () => {
      it("Pattern 13 の基本形を検証する", () => {
        expect(validateHaishikiSyntax("13")).toBe(true);
      });

      it("ギャップを含むパターンを検証する", () => {
        expect(validateHaishikiSyntax("103")).toBe(true); // 1枚、ギャップ、3枚
        expect(validateHaishikiSyntax("301")).toBe(true); // 3枚、ギャップ、1枚
      });

      it("複雑なパターンを検証する", () => {
        expect(validateHaishikiSyntax("1111")).toBe(true); // 各位置に1枚ずつ
        expect(validateHaishikiSyntax("4321")).toBe(true); // 降順の枚数
      });

      it("将来の Pattern 313 のような形式を検証する", () => {
        expect(validateHaishikiSyntax("313")).toBe(true); // サポート外だが構文は有効
      });
    });
  });

  describe("isPatternId と validateHaishikiSyntax の関係", () => {
    it("isPatternId が true なら validateHaishikiSyntax も true である", () => {
      // isPatternId はサポート状態もチェックする、より厳格な検証
      const supportedPattern = "13";

      expect(isPatternId(supportedPattern)).toBe(true);
      expect(validateHaishikiSyntax(supportedPattern)).toBe(true);
    });

    it("validateHaishikiSyntax が true でも isPatternId が false のケースがある", () => {
      // 構文は有効だがサポートされていないパターン
      const unsupportedPattern = "103";

      expect(validateHaishikiSyntax(unsupportedPattern)).toBe(true);
      expect(isPatternId(unsupportedPattern)).toBe(false);
    });

    it("validateHaishikiSyntax が false なら isPatternId も false である", () => {
      const invalidSyntax = "555";

      expect(validateHaishikiSyntax(invalidSyntax)).toBe(false);
      expect(isPatternId(invalidSyntax)).toBe(false);
    });
  });
});
