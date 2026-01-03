import {
    HaiKind,
    HaiKindId,
    HaiType,
    calculateShanten,
    getUkeire,
} from "@pai-forge/riichi-mahjong";
import { Suupai } from "../../types";

// Tile Sets
/** 萬子 (Manzu) の牌セット */
export const MANZU_HAIS: readonly HaiKindId[] = [
    HaiKind.ManZu1, HaiKind.ManZu2, HaiKind.ManZu3, HaiKind.ManZu4, HaiKind.ManZu5,
    HaiKind.ManZu6, HaiKind.ManZu7, HaiKind.ManZu8, HaiKind.ManZu9,
];
/** 筒子 (Pinzu) の牌セット */
export const PINZU_HAIS: readonly HaiKindId[] = [
    HaiKind.PinZu1, HaiKind.PinZu2, HaiKind.PinZu3, HaiKind.PinZu4, HaiKind.PinZu5,
    HaiKind.PinZu6, HaiKind.PinZu7, HaiKind.PinZu8, HaiKind.PinZu9,
];
/** 索子 (Souzu) の牌セット */
export const SOUZU_HAIS: readonly HaiKindId[] = [
    HaiKind.SouZu1, HaiKind.SouZu2, HaiKind.SouZu3, HaiKind.SouZu4, HaiKind.SouZu5,
    HaiKind.SouZu6, HaiKind.SouZu7, HaiKind.SouZu8, HaiKind.SouZu9,
];

/**
 * 牌種IDを回答用の数値 (1-9) に変換する
 * @param hai 牌種ID
 */
export const haiKindToNumber = (hai: HaiKindId): number => {
    if (hai >= HaiKind.ManZu1 && hai <= HaiKind.ManZu9) return hai - HaiKind.ManZu1 + 1;
    if (hai >= HaiKind.PinZu1 && hai <= HaiKind.PinZu9) return hai - HaiKind.PinZu1 + 1;
    if (hai >= HaiKind.SouZu1 && hai <= HaiKind.SouZu9) return hai - HaiKind.SouZu1 + 1;
    return 0;
};

export interface GameState {
    readonly tehai: readonly HaiKindId[];
    readonly tsumo: HaiKindId | null; // null for 13 tiles (waiting)
    readonly machi: readonly HaiKindId[];
    readonly suit: Suupai;
}

/**
 * チンイツのテンパイ形の出題データを生成する
 *
 * @param forceSuit 出題するスート (指定がない場合はランダム)
 */
export function generateProblem(forceSuit?: Suupai): GameState {
    let tehai: HaiKindId[] = [];
    let attempts = 0;

    // Select suit
    let targetSuit: Suupai = forceSuit ?? HaiType.Manzu;
    if (!forceSuit) {
        const r = Math.random();
        if (r < 0.33) targetSuit = HaiType.Manzu;
        else if (r < 0.66) targetSuit = HaiType.Pinzu;
        else targetSuit = HaiType.Souzu;
    }

    const haiSet =
        targetSuit === HaiType.Manzu ? MANZU_HAIS :
            targetSuit === HaiType.Pinzu ? PINZU_HAIS :
                SOUZU_HAIS;

    while (attempts < 1000) {
        tehai = generateRandomTehai13(haiSet);
        const shanten = calculateShanten({ closed: tehai, exposed: [] });

        // shanten === 0 means Tenpai (ready)
        if (shanten === 0) {
            const ukeire = getUkeire({ closed: tehai, exposed: [] });
            if (ukeire.length > 0) {
                return {
                    tehai: tehai.sort((a, b) => a - b),
                    tsumo: null,
                    machi: ukeire,
                    suit: targetSuit,
                };
            }
        }
        attempts++;
    }

    // Fallback (simple hand) if generation fails - use selected suit
    const fallbackTehai: HaiKindId[] = [
        haiSet[0], haiSet[0], haiSet[0],
        haiSet[1], haiSet[2], haiSet[3],
        haiSet[4], haiSet[5], haiSet[6],
        haiSet[7], haiSet[8], haiSet[8], haiSet[8]
    ];

    return {
        tehai: fallbackTehai,
        tsumo: null,
        machi: getUkeire({ closed: fallbackTehai, exposed: [] }),
        suit: targetSuit,
    };
}

function generateRandomTehai13(haiSet: readonly HaiKindId[]): HaiKindId[] {
    // Create yama (4 of each tile in the set)
    const yama = [...haiSet, ...haiSet, ...haiSet, ...haiSet];
    const tehai: HaiKindId[] = [];

    // Pick 13 tiles
    for (let i = 0; i < 13; i++) {
        const randomIndex = Math.floor(Math.random() * yama.length);
        const drawn = yama[randomIndex];
        // TS knows drawn is defined because of index bounds (and noUncheckedIndexedAccess=false)
        tehai.push(drawn);
        yama.splice(randomIndex, 1);
    }

    return tehai;
}

/**
 * Check if the user's selected waits match the correct waits exactly.
 */
export function checkAnswer(
    selectedMachi: readonly HaiKindId[],
    machi: readonly HaiKindId[],
): boolean {
    if (selectedMachi.length !== machi.length) return false;

    const sortedSelected = [...selectedMachi].sort((a, b) => a - b);
    const sortedCorrect = [...machi].sort((a, b) => a - b);

    return sortedSelected.every((val, index) => val === sortedCorrect[index]);
}
