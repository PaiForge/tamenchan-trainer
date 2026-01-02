import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { HaiKindId } from '@pai-forge/riichi-mahjong';
import { generateProblem, checkAnswer, GameState } from '../../../features/training/GameManager';
import { CheatsheetModal } from '../../../components/CheatsheetModal';

// Components
import { CustomBackButton } from './components/CustomBackButton';
import { GameStatus } from './components/GameStatus';
import { AnswerInput } from './components/AnswerInput';
import { ActionButtons } from './components/ActionButtons';
import { HandDisplay } from './components/HandDisplay';

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
    const calculatedTileWidth = Math.min(MAX_TILE_WIDTH, (AVAILABLE_WIDTH - TOTAL_GAPS_WIDTH) / NUM_TILES);
    const scaleFactor = calculatedTileWidth / MAX_TILE_WIDTH;
    const calculatedTileHeight = MAX_TILE_HEIGHT * scaleFactor;

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

    if (!gameState) return <View className="flex-1 bg-gray-900" />;

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <Stack.Screen
                options={{
                    title: 'Training Mode',
                    headerLeft: () => <CustomBackButton />,
                }}
            />

            {/* Main Content (Inputs & Status) - Takes available space */}
            <View className="flex-1 justify-center">
                <GameStatus isCorrect={isCorrect} />

                <AnswerInput
                    selectedWaits={selectedWaits}
                    onToggleWait={toggleWait}
                    isPortrait={isPortrait}
                />

                <ActionButtons
                    onOpenCheatSheet={() => setIsCheatSheetVisible(true)}
                    onSubmit={handleSubmit}
                    onSkip={startNewGame}
                    isCorrect={isCorrect}
                />
            </View>

            {/* Hand Display (Fixed at bottom) */}
            <HandDisplay
                hand={gameState.hand}
                calculatedTileWidth={calculatedTileWidth}
                calculatedTileHeight={calculatedTileHeight}
            />

            <CheatsheetModal
                visible={isCheatSheetVisible}
                onClose={() => setIsCheatSheetVisible(false)}
                correctWaits={gameState.correctWaits}
            />
        </SafeAreaView>
    );
}
