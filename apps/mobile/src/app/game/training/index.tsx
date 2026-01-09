import React, { useEffect, useState } from "react";
import { View, useWindowDimensions, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { HaiKindId } from "@pai-forge/riichi-mahjong";
import {
  generateProblemSet,
  checkAnswer,
  GameState,
} from "../../../features/training/GameManager";
import { CheatsheetModal } from "../../../components/CheatsheetModal";

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
  // const { preferredSuit } = useSettings(); // Use if needed later
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedMachi, setSelectedMachi] = useState<HaiKindId[]>([]);
  const [isCheatSheetVisible, setIsCheatSheetVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isPortrait = screenHeight > screenWidth;

  // Game Flow State
  const [problemPool, setProblemPool] = useState<GameState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

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
    startNewGameFlow();
  }, []);

  const startNewGameFlow = () => {
    // Generate mixed problem set (1 Interference, 2 Penchan, 7 Normal)
    // The internal logic of generateProblemSet handles the distribution when count >= 10.
    const pool = generateProblemSet(10, {
      patternId: "13", // Base config (ignored internally for mixed generation logic)
      requirePenchan: false,
      requireInterference: false,
    });

    setProblemPool(pool);
    setCurrentIndex(0);
    setIsFinished(false);
    setGameState(pool[0]); // Load first
    setSelectedMachi([]);
    setIsCorrect(null);
  };

  // Removed loadQuestion as we pre-generate problems.
  // const loadQuestion = ...

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
        const nextIndex = currentIndex + 1;
        if (nextIndex < problemPool.length) {
          setCurrentIndex(nextIndex);
          setGameState(problemPool[nextIndex]);
          setSelectedMachi([]);
          setIsCorrect(null);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    }
  };

  // Result Screen
  if (isFinished) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-4xl text-text font-bold mb-8">Finish!</Text>

        <View className="flex-row gap-4">
          <Pressable
            className="bg-surface px-6 py-3 rounded-lg border border-border"
            onPress={() => {
              router.replace("/");
            }}
          >
            <Text className="text-text font-bold">Home</Text>
          </Pressable>
          <Pressable
            className="bg-primary px-6 py-3 rounded-lg"
            onPress={startNewGameFlow}
          >
            <Text className="text-white font-bold">Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!gameState) return <View className="flex-1 bg-background" />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: `Question ${currentIndex + 1} / 10`,
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
          onOpenCheatSheet={() => {
            setIsCheatSheetVisible(true);
          }}
          onSubmit={handleSubmit}
          onSkip={() => {
            // Skip logic: Instant next
            const nextIndex = currentIndex + 1;
            if (nextIndex < problemPool.length) {
              setCurrentIndex(nextIndex);
              setGameState(problemPool[nextIndex]);
              setSelectedMachi([]);
              setIsCorrect(null);
            } else {
              setIsFinished(true);
            }
          }}
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
        onClose={() => {
          setIsCheatSheetVisible(false);
        }}
        machi={gameState.machi}
      />
    </SafeAreaView>
  );
}
