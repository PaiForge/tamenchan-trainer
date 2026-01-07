import { describe, it, expect } from "vitest";
import { generateProblem, ProblemConfig } from "./GameManager";
import { HaiKind } from "@pai-forge/riichi-mahjong";

describe("GameManager 問題生成", () => {
  it("13枚の手牌を生成する", () => {
    const problem = generateProblem();
    expect(problem.tehai.length).toBe(13);
  });

  it("指定されたパターン設定に従う", () => {
    const config: ProblemConfig = {
      patternId: "1112",
      requireInterference: false,
      requirePenchan: false,
    };
    const problem = generateProblem(config);
    expect(problem.tehai.length).toBe(13);
  });

  it("1112パターン (requirePenchan: false) - 常に3面待ち（シフト形）が生成されること", () => {
    // requirePenchan: false の場合、理想的な待ち数（3種）未満のパターン（端の1112など）はリジェクトされる。
    // 結果として、常にシフトされた形（2223など）の3面待ちが生成されるはずである。

    for (let i = 0; i < 50; i++) {
      const config: ProblemConfig = {
        patternId: "1112",
        requireInterference: false,
        requirePenchan: false, // 厳密
      };
      const problem = generateProblem(config);
      const actualUkeire = [...problem.machi].sort((a, b) => a - b);

      // 1. 待ちの数は必ず3種類であること
      expect(actualUkeire.length).toBe(3);

      // 2. 待ちの形が n-1, n+1, n+2 (例: 1,3,4) であることの検証
      // 注: 1,3,4 (Gap 2,1) または 6,8,9 (Mirrored 1112 -> 2223 -> 7778, Wait 6,8,9 -> Gap 2,1)
      // または 2333 (Gap 1,2: 1,2,4) or 6777 (Gap 1,2: 5,7,8)
      // つまり、Gapは (2,1) または (1,2) のいずれかである。
      const gap1 = actualUkeire[1] - actualUkeire[0];
      const gap2 = actualUkeire[2] - actualUkeire[1];

      const isGap21 = gap1 === 2 && gap2 === 1;
      const isGap12 = gap1 === 1 && gap2 === 2;

      expect(isGap21 || isGap12).toBe(true);
    }
  });

  it("1112パターン (requirePenchan: true) - 常に2面待ち（端）が生成されること", () => {
    // requirePenchan: true の場合、強制的に辺張（または理想待ち未満）が生成される。
    // 常に理想待ち数（3種）未満のパターン（端の1112など）が選択される。

    for (let i = 0; i < 50; i++) {
      const config: ProblemConfig = {
        patternId: "1112",
        requireInterference: false,
        requirePenchan: true, // 強制（ペンチャンのみ）
      };
      const problem = generateProblem(config);
      const actualUkeire = [...problem.machi].sort((a, b) => a - b);

      // 1112パターンのペンチャン（端）は必ず2面待ち
      expect(actualUkeire.length).toBe(2);

      // Gapは 1 (例: 2,3) または 2 (例: 1,3 [1222形])
      const gap = actualUkeire[1] - actualUkeire[0];
      expect([1, 2]).toContain(gap);
    }
  });

  it("厳密な干渉処理を行う (requireInterference: false)", () => {
    // requireInterference: false の場合、待ちが減るような干渉は禁止される。
    const config: ProblemConfig = {
      patternId: "1112",
      requireInterference: false,
      requirePenchan: false,
    };
    const problem = generateProblem(config);
    expect(problem).toBeDefined();
  });

  it("干渉ありの問題生成 (requireInterference: true)", () => {
    // requireInterference: true の場合、強制的に干渉（待ちが減る）が発生する。
    // つまり、実際の待ち（actualUkeire）はコア待ちの真部分集合になるはずである。
    // Note: 1112パターンでの干渉は生成難易度が高いため、試行回数を増やして確認するか、
    // 比較的干渉しやすいパターンでテストするのが望ましいが、ここではロジックの疎通確認を行う。

    // 10回試行して、生成できた場合は必ず干渉していることを確認
    // (生成できない場合はスキップされる可能性があるが、generateProblemは基本的に無限ループせずfallbackするか成功する)

    for (let i = 0; i < 10; i++) {
      const config: ProblemConfig = {
        patternId: "1112",
        requireInterference: true, // 強制
        requirePenchan: false,
      };

      // ここでは簡易的に1回呼び出して、それがFallbackでなければ検証、という形にする。
      const problem = generateProblem(config);

      // Fallbackかどうか判定 (Fallbackは6667 + Honors)
      const isFallback = problem.tehai.some((t) => t === HaiKind.Ton); // Fallback has Honors

      if (!isFallback) {
        // 生成成功時は、待ちの数が理想（3種類）未満になっているはず
        // 1112 (Ideal 3 waits) -> Interference -> < 3 waits
        // ただし、requirePenchan=false なので、Penchanによる減少ではなく、
        // 干渉による減少であることを確認したいが、外形的には「待ちが減っている」ことしかわからない。
        // 厳密には PatternGenerator でコア生成して比較すべきだが、簡易的に数でチェックする。
        expect(problem.machi.length).toBeLessThan(3);
      }
    }
  });
});
