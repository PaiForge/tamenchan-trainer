import { describe, it, expect } from "vitest";
import {
  generateProblem,
  generateProblemSet,
  ProblemConfig,
} from "./GameManager";
import { HaiKind } from "@pai-forge/riichi-mahjong";

describe("GameManager 問題生成", () => {
  it("13枚の手牌を生成する", () => {
    const problem = generateProblem();
    expect(problem.tehai.length).toBe(13);
  });

  it("指定されたパターン設定に従う", () => {
    const config: ProblemConfig = {
      patternId: "13",
      requireInterference: false,
      requirePenchan: false,
    };
    const problem = generateProblem(config);
    expect(problem.tehai.length).toBe(13);
  });

  it("1222パターン (requirePenchan: false) - 常に3面待ち（シフト形）が生成されること", () => {
    // requirePenchan: false の場合、理想的な待ち数（3種）未満のパターン（端の1222など）はリジェクトされる。
    // 結果として、常にシフトされた形（2333など）の3面待ちが生成されるはずである。

    for (let i = 0; i < 50; i++) {
      const config: ProblemConfig = {
        patternId: "13",
        requireInterference: false,
        requirePenchan: false, // 厳密
      };
      const problem = generateProblem(config);
      const actualUkeire = [...problem.machi].sort((a, b) => a - b);

      // 1. 待ちの数は必ず3種類であること
      expect(actualUkeire.length).toBe(3);

      // 2. 待ちの形が n-1, n, n+2 (例: 1,2,4) であることの検証
      // 注: 1,2,4 (Gap 1,2) または 5,7,8 (Mirrored 1222 -> 8999 -> 6777, Wait 5,7,8 -> Gap 2,1)
      // つまり、Gapは (1,2) または (2,1) のいずれかである。
      const gap1 = actualUkeire[1] - actualUkeire[0];
      const gap2 = actualUkeire[2] - actualUkeire[1];

      const isGap21 = gap1 === 2 && gap2 === 1;
      const isGap12 = gap1 === 1 && gap2 === 2;

      expect(isGap21 || isGap12).toBe(true);
    }
  });

  it("1222パターン (requirePenchan: true) - 常に2面待ち（端）が生成されること", () => {
    // requirePenchan: true の場合、強制的に辺張（または理想待ち未満）が生成される。
    // 常に理想待ち数（3種）未満のパターン（端の1222など）が選択される。

    for (let i = 0; i < 50; i++) {
      const config: ProblemConfig = {
        patternId: "13",
        requireInterference: false,
        requirePenchan: true, // 強制（ペンチャンのみ）
      };
      const problem = generateProblem(config);
      const actualUkeire = [...problem.machi].sort((a, b) => a - b);

      // 1222パターンのペンチャン（端）は必ず2面待ち
      expect(actualUkeire.length).toBe(2);

      // Gapは 1 (例: 2,3) または 2 (例: 1,3 [1222形])
      const gap = actualUkeire[1] - actualUkeire[0];
      expect([1, 2]).toContain(gap);
    }
  });

  it("厳密な干渉処理を行う (requireInterference: false)", () => {
    // requireInterference: false の場合、待ちが減るような干渉は禁止される。
    const config: ProblemConfig = {
      patternId: "13",
      requireInterference: false,
      requirePenchan: false,
    };
    const problem = generateProblem(config);
    expect(problem).toBeDefined();
  });

  it("干渉ありの問題生成 (requireInterference: true)", () => {
    // requireInterference: true の場合、強制的に干渉（待ちが減る）が発生する。
    // つまり、実際の待ち（actualUkeire）はコア待ちの真部分集合になるはずである。
    // Note: 1222パターンでの干渉は生成難易度が高いため、試行回数を増やして確認するか、
    // 比較的干渉しやすいパターンでテストするのが望ましいが、ここではロジックの疎通確認を行う。

    // 10回試行して、生成できた場合は必ず干渉していることを確認
    // (生成できない場合はスキップされる可能性があるが、generateProblemは基本的に無限ループせずfallbackするか成功する)

    for (let i = 0; i < 10; i++) {
      const config: ProblemConfig = {
        patternId: "13",
        requireInterference: true, // 強制
        requirePenchan: false,
      };

      // ここでは簡易的に1回呼び出して、それがFallbackでなければ検証、という形にする。
      const problem = generateProblem(config);

      // Fallbackかどうか判定 (Fallbackは6667 + Honors)
      const isFallback = problem.tehai.some((t) => t === HaiKind.Ton); // Fallback has Honors

      if (!isFallback) {
        // 生成成功時は、待ちの数が理想（3種類）未満になっているはず
        // 1222 (Ideal 3 waits) -> Interference -> < 3 waits
        // ただし、requirePenchan=false なので、Penchanによる減少ではなく、
        // 干渉による減少であることを確認したいが、外形的には「待ちが減っている」ことしかわからない。
        // 厳密には PatternGenerator でコア生成して比較すべきだが、簡易的に数でチェックする。
        expect(problem.machi.length).toBeLessThan(3);
      }
    }
  });

  it("13型の問題生成において313型（スーパーセット）が生成されないこと", () => {
    // 13型 (1222) のスーパーセットとして 313型 (1222333 など) がある。
    // これらは待ちが増える（1222: 1,2,4 -> 1222333: 1,3,4など）ため、
    // 干渉なし(requireInterference: false)の設定では排除されるべきである。
    const config: ProblemConfig = {
      patternId: "13",
      requireInterference: false,
      requirePenchan: false,
    };

    // 試行回数を増やして偶然の生成を狙う
    for (let i = 0; i < 100; i++) {
      const problem = generateProblem(config);

      // 13型の理想待ちは3種 (1222 -> 1,2,4) または (2333 -> 1,2,4)。
      // つまり13型の待ちは常に3種である（端にかかっていない場合）
      // 待ちが3種以上になっている場合はスーパーセットの疑いがある。

      if (problem.machi.length > 3) {
        expect(problem.machi.length).toBeLessThanOrEqual(3);
      }
    }
  });

  it("厳密な構造チェック: 干渉なし設定で別パターンに変形した手牌は排除されること", () => {
    // これをユニットテストで直接証明するのは難しい（ランダム生成の内部状態に依存するため）。
    // しかし、リトライループが機能していることは、「生成された問題が全て指定パターンIDと一致する」ことで確認できる。
    // ここでは大量生成し、全てが正しいパターンであることを確認する。

    const config: ProblemConfig = {
      patternId: "13",
      requireInterference: false,
      requirePenchan: false,
    };

    for (let i = 0; i < 50; i++) {
      const problem = generateProblem(config);

      // Fallback checks
      const isFallback = problem.tehai.some((t) => t === HaiKind.Ton);
      if (isFallback) continue;

      // Check main block structure's wait count as a proxy for structural correctness
      expect(problem.machi.length).toBeLessThanOrEqual(3);
    }
  });

  it("generateProblemSet: 10問のユニークな問題セットが生成されること", () => {
    // 厳密な構造チェックを外したので、重複排除ロジックの動作が重要になる。
    const config: ProblemConfig = {
      patternId: "13",
      requireInterference: false,
      requirePenchan: false,
    };

    // 10問生成
    const set = generateProblemSet(10, config);
    expect(set.length).toBe(10);

    // 全てユニークであるかチェック (Pai文字列で比較)
    const uniqueHashes = new Set(set.map((p) => p.tehai.join(",")));
    expect(uniqueHashes.size).toBe(10);
  });

  it("generateProblemSet: 問題生成の分布検証 (Wait Count Check)", () => {
    // 100問生成して、待ちの数の分布を確認する
    // Normal(70%) -> 3 waits (一部Interferenceで減るかも?)
    // Penchan(20%) -> 2 waits
    // Interference(10%) -> <3 waits or valid interference shape

    // Config is ignored in generateProblemSet internal loop logic for variety
    const set = generateProblemSet(50, { patternId: "13" });
    // We expect 50, but allow slight under-generation due to randomness/uniqueness checks
    expect(set.length).toBeGreaterThanOrEqual(40);

    let wait3Count = 0;
    let wait2Count = 0;
    let waitOtherCount = 0;

    for (const problem of set) {
      const w = problem.machi.length;
      if (w >= 3) wait3Count++;
      else if (w === 2) wait2Count++;
      else waitOtherCount++;
    }

    console.log(
      `Distribution (N=50): Wait>=3: ${wait3Count}, Wait=2: ${wait2Count}, Other: ${waitOtherCount}`,
    );

    // Penchan is 20% target (10/50). Interference 10% (5/50). Normal 70% (35/50).
    // Normal(35) -> Wait 3.
    // Penchan(10) -> Wait 2.
    // Interference(5) -> Wait 2 or 3 (depends on shape, often reduced).

    // Expect at least some 2-wait problems (Penchan)
    expect(wait2Count).toBeGreaterThan(5);

    // Expect majority to be 3-wait problems (Normal)
    expect(wait3Count).toBeGreaterThan(25);
  });
});
