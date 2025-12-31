import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Stack, router } from 'expo-router';
import { Hai } from 'mahjong-react-ui';
import { HaiKind, type HaiKindId } from 'riichi-mahjong';
import { generateProblem, checkAnswer, GameState, tileToNumber } from '../../src/features/training/GameManager';
import { CheatsheetModal } from '../../src/components/CheatsheetModal';

export default function TrainingScreen() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [selectedWaits, setSelectedWaits] = useState<HaiKindId[]>([]);
    const [isCheatSheetVisible, setIsCheatSheetVisible] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
            <Stack.Screen options={{ title: 'Training Mode' }} />

            {/* Hand Display */}
            <View style={styles.handSection}>
                <View style={styles.handContainer}>
                    {gameState.hand.map((tile, index) => (
                        <Hai key={index} hai={tile} size="md" />
                    ))}
                </View>
            </View>

            {/* Status / Feedback */}
            <View style={styles.statusSection}>
                {isCorrect === true && <Text style={styles.correctText}>正解！</Text>}
                {isCorrect === false && <Text style={styles.incorrectText}>不正解...</Text>}
            </View>

            {/* Answer Input */}
            <View style={styles.inputSection}>
                <Text style={styles.instructionText}>待ち牌をすべて選択してください</Text>
                <View style={styles.optionsContainer}>
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
    handSection: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    handContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
    },
    statusSection: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
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
        flex: 3,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    instructionText: {
        color: '#9ca3af', // gray-400
        marginBottom: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        flex: 1,
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
    }
});
