import React from "react";
import { View, Text, Pressable } from "react-native";
import { Hai } from "@pai-forge/mahjong-react-ui";
import { HaiKindId, HaiType } from "@pai-forge/riichi-mahjong";
import { Suupai } from "../../../../types";
import {
  MANZU_HAIS,
  PINZU_HAIS,
  SOUZU_HAIS,
} from "../../../../features/training/GameManager";

interface AnswerInputProps {
  readonly selectedMachi: readonly HaiKindId[];
  readonly onToggleMachi: (hai: HaiKindId) => void;
  readonly isPortrait: boolean;
  readonly suit: Suupai;
}

/**
 * 待ち牌を選択する入力コンポーネント
 */
export function AnswerInput({
  selectedMachi,
  onToggleMachi,
  isPortrait,
  suit,
}: Readonly<AnswerInputProps>) {
  const targetHais =
    suit === HaiType.Manzu
      ? MANZU_HAIS
      : suit === HaiType.Pinzu
        ? PINZU_HAIS
        : SOUZU_HAIS;

  // Layout constants
  const OPTION_TILE_WIDTH = 44; // md size
  const OPTION_BUTTON_PADDING = 4; // 2 * 2
  const OPTION_BUTTON_BORDER = 4; // 2 * 2
  const OPTION_ITEM_WIDTH =
    OPTION_TILE_WIDTH + OPTION_BUTTON_PADDING + OPTION_BUTTON_BORDER;
  const OPTION_GAP = 12;
  const PORTRAIT_GRID_WIDTH = OPTION_ITEM_WIDTH * 3 + OPTION_GAP * 2 + 10; // +10 buffer

  return (
    <View className="px-4 items-center mb-10">
      <Text className="text-gray-400 mb-4 text-base">
        待ち牌をすべて選択してください
      </Text>
      <View
        className="flex-row justify-center gap-3"
        style={
          isPortrait
            ? { width: PORTRAIT_GRID_WIDTH, flexWrap: "wrap" }
            : { width: "auto", flexWrap: "nowrap" }
        }
      >
        {targetHais.map((hai) => {
          const isSelected = selectedMachi.includes(hai);
          return (
            <Pressable
              key={hai}
              onPress={() => {
                onToggleMachi(hai);
              }}
              hitSlop={10}
              className="p-0.5 rounded border-2 relative items-center justify-center"
              style={{
                opacity: isSelected ? 1.0 : 0.5,
                borderColor: isSelected ? "#3b82f6" : "transparent",
                backgroundColor: isSelected ? "rgba(59, 130, 246, 0.2)" : "transparent",
              }}
            >
              {/* Wrap Hai in View with pointerEvents="none" to prevent it from stealing touches */}
              <View pointerEvents="none">
                <Hai hai={hai} size="md" />
              </View>

              {isSelected && (
                <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500" />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
