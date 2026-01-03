import React, { useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { HaiKindId } from "@pai-forge/riichi-mahjong";
import {
    generateProblem,
    checkAnswer,
    GameState,
} from "../../../features/training/GameManager";
import { CheatsheetModal } from "../../../components/CheatsheetModal";
import { useSettings } from "../../../features/settings/SettingsContext";

// Components
import { CustomBackButton } from "./_components/CustomBackButton";
import { GameStatus } from "./_components/GameStatus";
import { AnswerInput } from "./_components/AnswerInput";
import { ActionButtons } from "./_components/ActionButtons";
import { TehaiDisplay } from "./_components/TehaiDisplay";

/**
 *
 */
export default function TrainingScreen() {
    const { preferredSuit } = useSettings();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [selectedMachi, setSelectedMachi] = useState<HaiKindId[]>([]);
    const [isCheatSheetVisible, setIsCheatSheetVisible] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const isPortrait = screenHeight > screenWidth;

    const TEHAI_PADDING = 32; // 16 * 2
    const HAI_GAP = 2;
    const NUM_HAIS = 13;
    const TOTAL_GAPS_WIDTH = HAI_GAP * (NUM_HAIS - 1);
    const AVAILABLE_WIDTH = screenWidth - TEHAI_PADDING;

    // Configurable base size for 'lg' (56x78) or 'md' (44x62)
    // We want to target 'lg' size (56px) if possible, but shrink if needed.
    const MAX_TILE_WIDTH = 56;
    const MAX_TILE_HEIGHT = 78;

    // Calculate optimal width to fit 13 tiles
    const calculatedTileWidth = Math.min(
        MAX_TILE_WIDTH,
        (AVAILABLE_WIDTH - TOTAL_GAPS_WIDTH) / NUM_HAIS,
    );
    const scaleFactor = calculatedTileWidth / MAX_TILE_WIDTH;
    const calculatedTileHeight = MAX_TILE_HEIGHT * scaleFactor;

    // Initialize game
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const suit = preferredSuit === "random" ? undefined : preferredSuit;
        setGameState(generateProblem(suit));
        setSelectedMachi([]);
        setIsCorrect(null);
    };

    const toggleMachi = (hai: HaiKindId) => {
        if (isCorrect) return; // Disable input if already answered correctly

        if (selectedMachi.includes(hai)) {
            setSelectedMachi((prev) => prev.filter((t) => t !== hai));
        } else {
            setSelectedMachi((prev) => [...prev, hai]);
        }
    };

    const handleSubmit = () => {
        if (!gameState) return;
        const correct = checkAnswer(selectedMachi, gameState.machi);
        setIsCorrect(correct);

        if (correct) {
            setTimeout(() => {
                startNewGame();
            }, 1500);
        }
    };

    if (!gameState) return <View className="flex-1 bg-background" />;

    return (
        <SafeAreaView className="flex-1 bg-background">
            <Stack.Screen
                options={{
                    title: "Training Mode",
                    headerLeft: () => <CustomBackButton />,
                }}
            />

            {/* Main Content (Inputs & Status) - Takes available space */}
            <View className="flex-1 justify-center">
                <GameStatus isCorrect={isCorrect} />

                <AnswerInput
                    selectedMachi={selectedMachi}
                    onToggleMachi={toggleMachi}
                    isPortrait={isPortrait}
                    suit={gameState.suit}
                />

                <ActionButtons
                    onOpenCheatSheet={() => { setIsCheatSheetVisible(true); }}
                    onSubmit={handleSubmit}
                    onSkip={startNewGame}
                    isCorrect={isCorrect}
                />
            </View>

            {/* Hand Display (Fixed at bottom) */}
            <TehaiDisplay
                tehai={gameState.tehai}
                calculatedTileWidth={calculatedTileWidth}
                calculatedTileHeight={calculatedTileHeight}
            />

            <CheatsheetModal
                visible={isCheatSheetVisible}
                onClose={() => { setIsCheatSheetVisible(false); }}
                machi={gameState.machi}
            />
        </SafeAreaView>
    );
}
