import React from "react";
import { View, Text, Pressable } from "react-native";

interface ActionButtonsProps {
  readonly onOpenCheatSheet: () => void;
  readonly onSubmit: () => void;
  readonly onSkip: () => void;
  readonly isCorrect: boolean | null;
}

/**
 *
 */
export function ActionButtons({
  onOpenCheatSheet,
  onSubmit,
  onSkip,
  isCorrect,
}: Readonly<ActionButtonsProps>) {
  return (
    <View className="flex-row justify-around items-center px-6 pb-6">
      <Pressable className="p-3" onPress={onOpenCheatSheet}>
        <Text className="text-gray-400 underline">答えを見る</Text>
      </Pressable>

      <Pressable
        className={`py-3.5 px-8 rounded-lg min-w-[140px] items-center ${isCorrect ? "bg-gray-700" : "bg-blue-500"
          }`}
        onPress={onSubmit}
        disabled={isCorrect === true}
      >
        <Text className="text-white text-lg font-bold">回答する</Text>
      </Pressable>

      {isCorrect === false && (
        <Pressable className="p-3" onPress={onSkip}>
          <Text className="text-white">スキップ</Text>
        </Pressable>
      )}
    </View>
  );
}
