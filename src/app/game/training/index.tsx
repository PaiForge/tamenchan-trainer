import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, useWindowDimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Hai } from '@pai-forge/mahjong-react-ui';
import { HaiKind, type HaiKindId } from '@pai-forge/riichi-mahjong';
import { generateProblem, checkAnswer, GameState, tileToNumber } from '../../../features/training/GameManager';
import { CheatsheetModal } from '../../../components/CheatsheetModal';

export default function TrainingScreen() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [selectedWaits, setSelectedWaits] = useState<HaiKindId[]>([]);
    const [isCheatSheetVisible, setIsCheatSheetVisible] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const isPortrait = screenHeight > screenWidth;

    const HAND_PADDING = 32; // 16 * 2
    const TILE_GAP = 2;
    const NUM_TILES = 13;
    const TOTAL_GAPS_WIDTH = TILE_GAP * (NUM_TILES - 1);
    const AVAILABLE_WIDTH = screenWidth - HAND_PADDING;

    // Configurable base size for 'lg' (56x78) or 'md' (44x62)
    // We want to target 'lg' size (56px) if possible, but shrink if needed.
    const MAX_TILE_WIDTH = 56;
    const MAX_TILE_HEIGHT = 78;

    // Calculate optimal width to fit 13 tiles
    // optimalWidth * 13 + gaps <= availableWidth
    const calculatedTileWidth = Math.min(MAX_TILE_WIDTH, (AVAILABLE_WIDTH - TOTAL_GAPS_WIDTH) / NUM_TILES);
    const scaleFactor = calculatedTileWidth / MAX_TILE_WIDTH;
    const calculatedTileHeight = MAX_TILE_HEIGHT * scaleFactor;

    // Answer options layout
    // 'md' tile is 44px wide. Button padding=2*2, border=2*2. Total approx 52px.
    // Gap 12. 3 items = 52*3 + 12*2 = 156 + 24 = 180.
    // We set a constrained width for Portrait to force wrapping.
    const OPTION_TILE_WIDTH = 44; // md size
    const OPTION_BUTTON_PADDING = 4; // 2 * 2
    const OPTION_BUTTON_BORDER = 4; // 2 * 2
    const OPTION_ITEM_WIDTH = OPTION_TILE_WIDTH + OPTION_BUTTON_PADDING + OPTION_BUTTON_BORDER;
    const OPTION_GAP = 12;
    const PORTRAIT_GRID_WIDTH = (OPTION_ITEM_WIDTH * 3) + (OPTION_GAP * 2) + 10; // +10 buffer

    // Initialize game
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        setGameState(generateProblem());
        setSelectedWaits([]);
        setIsCorrect(null);
    };

    const toggleWait = (tile: HaiKindId) => {
        if (isCorrect) return; // Disable input if already answered correctly

        if (selectedWaits.includes(tile)) {
            setSelectedWaits(prev => prev.filter(t => t !== tile));
        } else {
            setSelectedWaits(prev => [...prev, tile]);
        }
    };

    const handleSubmit = () => {
        if (!gameState) return;
        const correct = checkAnswer(selectedWaits, gameState.correctWaits);
        setIsCorrect(correct);

        if (correct) {
            setTimeout(() => {
                startNewGame();
            }, 1500);
        }
    };

    // Answer options (Manzu 1-9)
    const answerOptions = [
        HaiKind.ManZu1, HaiKind.ManZu2, HaiKind.ManZu3,
        HaiKind.ManZu4, HaiKind.ManZu5, HaiKind.ManZu6,
        HaiKind.ManZu7, HaiKind.ManZu8, HaiKind.ManZu9,
    ];

    if (!gameState) return <View style={styles.container} />;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Training Mode',
                    headerLeft: () => (
                        <Pressable onPress={() => router.replace('/')} style={{ marginLeft: 8, padding: 4 }}>
                            <Ionicons name="chevron-back" size={28} color="#007AFF" />
                        </Pressable>
                    ),

                }}
            />

            {/* Main Content (Inputs & Status) - Takes available space */}
            <View style={styles.mainContent}>

                {/* Status / Feedback */}
                <View style={styles.statusSection}>
                    {isCorrect === true && <Text style={styles.correctText}>正解！</Text>}
                    {isCorrect === false && <Text style={styles.incorrectText}>不正解...</Text>}
                </View>

                {/* Answer Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.instructionText}>待ち牌をすべて選択してください</Text>
                    <View style={[
                        styles.optionsContainer,
                        isPortrait
                            ? { width: PORTRAIT_GRID_WIDTH, flexWrap: 'wrap' }
                            : { width: 'auto', flexWrap: 'nowrap' }
                    ]}>
                        {answerOptions.map((tile) => (
                            <Pressable
                                key={tile}
                                onPress={() => toggleWait(tile)}
                                style={[
                                    styles.optionButton,
                                    selectedWaits.includes(tile) && styles.optionSelected
                                ]}
                            >
                                <Hai hai={tile} size="md" />
                                {selectedWaits.includes(tile) && (
                                    <View style={styles.checkMark} />
                                )}
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionSection}>
                    <Pressable
                        style={styles.cheatButton}
                        onPress={() => setIsCheatSheetVisible(true)}
                    >
                        <Text style={styles.cheatButtonText}>答えを見る</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.submitButton, isCorrect && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={isCorrect === true}
                    >
                        <Text style={styles.submitButtonText}>回答する</Text>
                    </Pressable>

                    {isCorrect === false && (
                        <Pressable style={styles.nextButton} onPress={startNewGame}>
                            <Text style={styles.nextButtonText}>スキップ</Text>
                        </Pressable>
                    )}
                </View>
            </View>

            {/* Hand Display (Fixed at bottom) */}
            <View style={styles.handSection}>
                <View style={styles.handContainer}>
                    {gameState.hand.map((tile, index) => (
                        <Hai
                            key={index}
                            hai={tile}
                            size="lg"
                            style={{
                                width: calculatedTileWidth,
                                height: calculatedTileHeight
                            }}
                        />
                    ))}
                </View>
            </View>

            <CheatsheetModal
                visible={isCheatSheetVisible}
                onClose={() => setIsCheatSheetVisible(false)}
                correctWaits={gameState.correctWaits}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827', // gray-900
    },
    mainContent: {
        flex: 1, // Takes all available space above the hand
        justifyContent: 'center',
    },
    statusSection: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    correctText: {
        color: '#34d399', // emerald-400
        fontSize: 24,
        fontWeight: 'bold',
    },
    incorrectText: {
        color: '#f87171', // red-400
        fontSize: 24,
        fontWeight: 'bold',
    },
    inputSection: {
        paddingHorizontal: 16,
        alignItems: 'center',
        marginBottom: 40,
    },
    instructionText: {
        color: '#9ca3af', // gray-400
        marginBottom: 16,
        fontSize: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    optionButton: {
        padding: 2,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    optionSelected: {
        borderColor: '#3b82f6', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
    checkMark: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#3b82f6', // blue-500
    },
    actionSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    cheatButton: {
        padding: 12,
    },
    cheatButtonText: {
        color: '#9ca3af', // gray-400
        textDecorationLine: 'underline',
    },
    submitButton: {
        backgroundColor: '#3b82f6', // blue-500
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        minWidth: 140,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#374151', // gray-700
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    nextButton: {
        padding: 12,
    },
    nextButtonText: {
        color: '#fff',
    },
    handSection: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#1f2937', // gray-800 background distinction
        borderTopWidth: 1,
        borderTopColor: '#374151', // gray-700
        alignItems: 'center',
    },
    handContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        gap: 2,
    },
});
