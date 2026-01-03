import {
    HaiKind,
    HaiKindId,
    HaiType,
    calculateShanten,
    getUkeire,
} from "@pai-forge/riichi-mahjong";
import { Suupai } from "../../types";

// Tile Sets
export const MANZU_TILES = [
    HaiKind.ManZu1, HaiKind.ManZu2, HaiKind.ManZu3, HaiKind.ManZu4, HaiKind.ManZu5,
    HaiKind.ManZu6, HaiKind.ManZu7, HaiKind.ManZu8, HaiKind.ManZu9,
];
export const PINZU_TILES = [
    HaiKind.PinZu1, HaiKind.PinZu2, HaiKind.PinZu3, HaiKind.PinZu4, HaiKind.PinZu5,
    HaiKind.PinZu6, HaiKind.PinZu7, HaiKind.PinZu8, HaiKind.PinZu9,
];
export const SOUZU_TILES = [
    HaiKind.SouZu1, HaiKind.SouZu2, HaiKind.SouZu3, HaiKind.SouZu4, HaiKind.SouZu5,
    HaiKind.SouZu6, HaiKind.SouZu7, HaiKind.SouZu8, HaiKind.SouZu9,
];

// Map HaiKindId to number (1-9) for answering
export const tileToNumber = (tile: HaiKindId): number => {
    if (tile >= HaiKind.ManZu1 && tile <= HaiKind.ManZu9) return tile - HaiKind.ManZu1 + 1;
    if (tile >= HaiKind.PinZu1 && tile <= HaiKind.PinZu9) return tile - HaiKind.PinZu1 + 1;
    if (tile >= HaiKind.SouZu1 && tile <= HaiKind.SouZu9) return tile - HaiKind.SouZu1 + 1;
    return 0;
};

export interface GameState {
    readonly hand: readonly HaiKindId[];
    readonly tsumo: HaiKindId | null; // null for 13 tiles (waiting)
    readonly correctWaits: readonly HaiKindId[];
    readonly suit: Suupai;
}

/**
 * Generate a random Chinitsu hand that is Tenpai (ready to win).
 * Returns 13 tiles.
 */
export function generateProblem(forceSuit?: Suupai): GameState {
    let hand: HaiKindId[] = [];
    let attempts = 0;

    // Select suit
    let targetSuit: Suupai = forceSuit ?? HaiType.Manzu;
    if (!forceSuit) {
        const r = Math.random();
        if (r < 0.33) targetSuit = HaiType.Manzu;
        else if (r < 0.66) targetSuit = HaiType.Pinzu;
        else targetSuit = HaiType.Souzu;
    }

    const tileSet =
        targetSuit === HaiType.Manzu ? MANZU_TILES :
            targetSuit === HaiType.Pinzu ? PINZU_TILES :
                SOUZU_TILES;

    while (attempts < 1000) {
        hand = generateRandomHand13(tileSet);
        const shanten = calculateShanten({ closed: hand, exposed: [] });

        // shanten === 0 means Tenpai (ready)
        if (shanten === 0) {
            const ukeire = getUkeire({ closed: hand, exposed: [] });
            if (ukeire.length > 0) {
                return {
                    hand: hand.sort((a, b) => a - b),
                    tsumo: null,
                    correctWaits: ukeire,
                    suit: targetSuit,
                };
            }
        }
        attempts++;
    }

    // Fallback (simple hand) if generation fails - use selected suit
    const fallbackHand: HaiKindId[] = [
        tileSet[0], tileSet[0], tileSet[0],
        tileSet[1], tileSet[2], tileSet[3],
        tileSet[4], tileSet[5], tileSet[6],
        tileSet[7], tileSet[8], tileSet[8], tileSet[8]
    ];

    return {
        hand: fallbackHand,
        tsumo: null,
        correctWaits: getUkeire({ closed: fallbackHand, exposed: [] }),
        suit: targetSuit,
    };
}

function generateRandomHand13(tileSet: readonly number[]): HaiKindId[] {
    // Create deck (4 of each tile in the set)
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const deck = [...tileSet, ...tileSet, ...tileSet, ...tileSet] as HaiKindId[];
    const hand: HaiKindId[] = [];

    // Pick 13 tiles
    for (let i = 0; i < 13; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        hand.push(deck[randomIndex]);
        deck.splice(randomIndex, 1);
    }

    return hand;
}

/**
 * Check if the user's selected waits match the correct waits exactly.
 */
export function checkAnswer(
    selectedWaits: readonly HaiKindId[],
    correctWaits: readonly HaiKindId[],
): boolean {
    if (selectedWaits.length !== correctWaits.length) return false;

    const sortedSelected = [...selectedWaits].sort((a, b) => a - b);
    const sortedCorrect = [...correctWaits].sort((a, b) => a - b);

    return sortedSelected.every((val, index) => val === sortedCorrect[index]);
}
