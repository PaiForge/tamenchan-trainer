import { PatternId } from "../types";

/**
 * 牌式（Haishiki）を表すドメインクラス
 * ユビキタス言語で定義された「牌式」のロジックをカプセル化する
 */
export class Pai {
  /**
   * 牌式文字列 (例: "31")
   */
  readonly value: PatternId;

  private constructor(value: PatternId) {
    this.value = value;
  }

  /**
   * 牌式文字列からPaiオブジェクトを生成する
   * @param value 牌式文字列
   */
  static fromId(value: PatternId): Pai {
    return new Pai(value);
  }

  /**
   * 手牌（数値配列）からPaiオブジェクトを生成する
   * 正規化、辞書順比較、牌式変換を行う
   *
   * @param tiles 1-9の数値配列（スートは区別しない）
   */
  static fromTiles(tiles: readonly number[]): Pai {
    if (tiles.length === 0) {
      throw new Error("Empty tiles");
    }

    // 1. ソート
    const sorted = [...tiles].sort((a, b) => a - b);

    // 2. スライド（最小値を1にする）
    const originalSlide = Pai.slideToOne(sorted);
    const originalStr = originalSlide.join("");

    // 3. ミラー（10-n）してスライド
    const mirrored = sorted.map((n) => 10 - n).sort((a, b) => a - b);
    const mirroredSlide = Pai.slideToOne(mirrored);
    const mirroredStr = mirroredSlide.join("");

    // 4. 正規形の選択（辞書順で小さい方）
    // NOTE: ユビキタス言語の定義では「スライド形とミラー形のうち、辞書順で小さい方を正規ID」とし、
    // そこから牌式を導出する。
    // 例: 1112 -> "31", 1222 -> "13" ではなく、
    // 1222 (mirror)-> 1112 -> "31" となるため、まず正規化された「牌の形」を決める必要がある。
    // ここでは originalStr と mirroredStr のうち小さい方が「正規化された牌の並び」である。
    const canonicalTiles =
      originalStr < mirroredStr ? originalSlide : mirroredSlide;

    // 5. 牌式への変換
    // 正規化された牌の並びを牌式文字列に変換する
    // 例: [1,1,1,2] -> "31"
    const haishiki = Pai.tilesToHaishiki(canonicalTiles);

    // バリデーションなしで返す（未知のパターンかもしれないため）
    // PatternId型にキャストできるかは呼び出し元で確認するか、別途バリデーションが必要だが、
    // ここではロジックとして変換を行う。
    // ただし、戻り値の型安全性のために、ここでは一旦キャストして返す。
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return new Pai(haishiki as PatternId);
  }

  /**
   * この牌式からランダムな実践形の手牌を生成する
   * @returns 1-9の数値配列
   */
  generateHand(): number[] {
    // 1. 牌式を展開して基本形（1から始まる形）を得る
    const baseTiles = Pai.haishikiToTiles(this.value);

    // 2. ランダムに反転 (50%)
    const useMirror = Math.random() < 0.5;
    let currentTiles = [...baseTiles];

    if (useMirror) {
      currentTiles = currentTiles.map((n) => 10 - n);
    }

    // 3. ランダムにスライド
    // min + shift >= 1  => shift >= 1 - min
    // max + shift <= 9  => shift <= 9 - max
    const min = Math.min(...currentTiles);
    const max = Math.max(...currentTiles);
    const minShift = 1 - min;
    const maxShift = 9 - max;

    const shift =
      Math.floor(Math.random() * (maxShift - minShift + 1)) + minShift;

    return currentTiles.map((n) => n + shift).sort((a, b) => a - b);
  }

  /**
   * 数値配列を最小値が1になるようにシフトする
   */
  private static slideToOne(tiles: readonly number[]): number[] {
    if (tiles.length === 0) return [];
    const min = tiles[0];
    return tiles.map((n) => n - min + 1);
  }

  /**
   * 正規化された（1から始まる）数字配列を牌式文字列に変換する
   * 例: [1,1,1,2] -> "31"
   * 例: [1,3,3,3] -> "103"
   */
  private static tilesToHaishiki(tiles: readonly number[]): string {
    if (tiles.length === 0) return "";
    const counts: number[] = [];
    const max = tiles[tiles.length - 1];

    // 1からmaxまでの各数字の枚数をカウント
    for (let i = 1; i <= max; i++) {
      const count = tiles.filter((t) => t === i).length;
      counts.push(count);
    }
    return counts.join("");
  }

  /**
   * 牌式文字列を基本形の数字配列に展開する
   * 例: "31" -> [1,1,1,2]
   * 例: "103" -> [1,3,3,3]
   */
  private static haishikiToTiles(haishiki: string): number[] {
    const tiles: number[] = [];
    for (let i = 0; i < haishiki.length; i++) {
      if (!/^\d$/.test(haishiki[i])) {
        throw new Error(`Invalid haishiki char: ${haishiki[i]}`);
      }
      const count = parseInt(haishiki[i], 10);
      const num = i + 1;
      for (let c = 0; c < count; c++) {
        tiles.push(num);
      }
    }
    return tiles;
  }
}
