import React, { useEffect, useState } from "react";
import { View, useWindowDimensions, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { HaiKindId } from "@pai-forge/riichi-mahjong";
import {
  generateProblem,
  checkAnswer,
  GameState,
  ProblemConfig,
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
  const [questionQueue, setQuestionQueue] = useState<ProblemConfig[]>([]);
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
    // Generate Question Queue
    const queue: ProblemConfig[] = [];

    // 2x Penchan
    queue.push({
      patternId: "1112",
      requirePenchan: true,
      requireInterference: false,
    });
    queue.push({
      patternId: "1112",
      requirePenchan: true,
      requireInterference: false,
    });
    // 2x Interference
    queue.push({
      patternId: "1112",
      requirePenchan: false,
      requireInterference: true,
    });
    queue.push({
      patternId: "1112",
      requirePenchan: false,
      requireInterference: true,
    });
    // 6x Normal
    for (let i = 0; i < 6; i++) {
      queue.push({
        patternId: "1112",
        requirePenchan: false,
        requireInterference: false,
      });
    }

    // Shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }

    setQuestionQueue(queue);
    setCurrentIndex(0);
    setIsFinished(false);
    setGameState(null); // Reset state

    // Load first question immediately
    loadQuestion(queue[0]);
  };

  const loadQuestion = (config: Readonly<ProblemConfig>) => {
    // Use preferred settings for suit if set, otherwise random logic inside GameManager handles it
    // Note: generateProblem now accepts ProblemConfig. To support fixed patterns + random suit/force suit logic properly,
    // we might need to adjust GameManager, but for now ProblemConfig implies "Suit" is random unless we extend it.
    // Current generateProblem implementation handles suit randomness internally if not specified.
    // However, we want to respect `preferredSuit`.
    // To do this, we need to adapt checking preferredSuit logic here, but generateProblem(config) doesn't take 'suit'.
    // Let's assume suit is random for now as per "1112型" training, or we can improve GameManager later.
    // *Correction*: generateProblem logic chooses suit randomly internally. Ideally we pass it.
    // For this task, we'll let GameManager decide the suit randomly.

    setGameState(generateProblem(config));
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
        const nextIndex = currentIndex + 1;
        if (nextIndex < questionQueue.length) {
          setCurrentIndex(nextIndex);
          loadQuestion(questionQueue[nextIndex]);
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
            // Skip logic: Treat as correct (or just move next)
            // For training, let's just move next with delay to show answer?
            // Or just instant next. Let's do instant next for flow.
            const nextIndex = currentIndex + 1;
            if (nextIndex < questionQueue.length) {
              setCurrentIndex(nextIndex);
              loadQuestion(questionQueue[nextIndex]);
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
