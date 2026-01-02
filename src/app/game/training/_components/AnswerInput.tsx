import React from "react";
import { View, Text, Pressable } from "react-native";
import { Hai } from "@pai-forge/mahjong-react-ui";
import { HaiKind, HaiKindId } from "@pai-forge/riichi-mahjong";

interface AnswerInputProps {
  readonly selectedWaits: readonly HaiKindId[];
  readonly onToggleWait: (tile: HaiKindId) => void;
  readonly isPortrait: boolean;
}

/**
 *
 */
export function AnswerInput({
  selectedWaits,
  onToggleWait,
  isPortrait,
}: Readonly<AnswerInputProps>) {
  const answerOptions = [
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
        {answerOptions.map((tile) => (
          <Pressable
            key={tile}
            onPress={() => { onToggleWait(tile); }}
            className={`p-0.5 rounded border-2 relative ${selectedWaits.includes(tile)
                ? "border-blue-500 bg-blue-500/20"
                : "border-transparent"
              }`}
          >
            <Hai hai={tile} size="md" />
            {selectedWaits.includes(tile) && (
              <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500" />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
