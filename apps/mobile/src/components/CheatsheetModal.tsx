import React from "react";
import { View, Text, Pressable } from "react-native";
import { Hai } from "@pai-forge/mahjong-react-ui";
import type { HaiKindId } from "@pai-forge/riichi-mahjong";
import { BaseModal } from "./BaseModal";

interface CheatsheetModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly machi: readonly HaiKindId[];
}

/**
 * 答え（待ち牌）を表示するモーダル
 */
export function CheatsheetModal({
  visible,
  onClose,
  machi,
}: Readonly<CheatsheetModalProps>) {
  return (
    <BaseModal visible={visible} onClose={onClose} title="正解（待ち牌）">
      <View className="flex-row flex-wrap gap-2 justify-center mb-8">
        {machi.map((tile, index) => (
          <Hai key={index} hai={tile} size="lg" />
        ))}
      </View>

      <View className="items-center">
        <Pressable
          className="bg-border py-3 px-8 rounded-xl min-w-[120px]"
          onPress={onClose}
        >
          <Text className="text-white font-bold text-center">閉じる</Text>
        </Pressable>
      </View>
    </BaseModal>
  );
}
