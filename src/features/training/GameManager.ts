import {
    HaiKind,
    HaiKindId,
    calculateShanten,
    getUkeire,
} from "@pai-forge/riichi-mahjong";

// Only Manzu for now (Chinitsu training)
const MANZU_TILES = [
    HaiKind.ManZu1,
    HaiKind.ManZu2,
    HaiKind.ManZu3,
    HaiKind.ManZu4,
    HaiKind.ManZu5,
    HaiKind.ManZu6,
    HaiKind.ManZu7,
    HaiKind.ManZu8,
    HaiKind.ManZu9,
];

// Map HaiKindId to number (1-9) for answering
export const tileToNumber = (tile: HaiKindId): number => {
    return tile - HaiKind.ManZu1 + 1;
};

export interface GameState {
    hand: HaiKindId[];
    tsumo: HaiKindId | null; // null for 13 tiles (waiting)
    correctWaits: HaiKindId[];
}

/**
 * Generate a random Chinitsu hand that is Tenpai (ready to win).
 * Returns 13 tiles.
 */
export function generateProblem(): GameState {
    let hand: HaiKindId[] = [];
    let attempts = 0;

    while (attempts < 1000) {
        hand = generateRandomHand13();
        const shanten = calculateShanten({ closed: hand, exposed: [] });

        // shanten === 0 means Tenpai (ready)
        if (shanten === 0) {
            const ukeire = getUkeire({ closed: hand, exposed: [] });
            if (ukeire.length > 0) {
                return {
                    hand: hand.sort((a, b) => a - b),
                    tsumo: null,
                    correctWaits: ukeire,
                };
            }
        }
        attempts++;
    }

    // Fallback (simple hand) if generation fails
    const fallbackHand = [
        HaiKind.ManZu1,
        HaiKind.ManZu1,
        HaiKind.ManZu1,
        HaiKind.ManZu2,
        HaiKind.ManZu3,
        HaiKind.ManZu4,
        HaiKind.ManZu5,
        HaiKind.ManZu6,
        HaiKind.ManZu7,
        HaiKind.ManZu8,
        HaiKind.ManZu9,
        HaiKind.ManZu9,
        HaiKind.ManZu9,
    ];
    return {
        hand: fallbackHand,
        tsumo: null,
        correctWaits: getUkeire({ closed: fallbackHand, exposed: [] }),
    };
}

function generateRandomHand13(): HaiKindId[] {
    const deck = [...MANZU_TILES, ...MANZU_TILES, ...MANZU_TILES, ...MANZU_TILES];
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
