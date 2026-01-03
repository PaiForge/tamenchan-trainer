import React from "react";
import { View } from "react-native";
import { Hai } from "@pai-forge/mahjong-react-ui";
import { HaiKindId } from "@pai-forge/riichi-mahjong";

interface TehaiDisplayProps {
  readonly tehai: readonly HaiKindId[];
  readonly calculatedTileWidth: number;
  readonly calculatedTileHeight: number;
}

/**
 * 手牌を表示するコンポーネント
 */
export function TehaiDisplay({
  tehai,
  calculatedTileWidth,
  calculatedTileHeight,
}: Readonly<TehaiDisplayProps>) {
  return (
    <View className="py-5 px-4 bg-gray-800 border-t border-gray-700 items-center">
      <View className="flex-row flex-nowrap justify-center gap-[2px]">
        {tehai.map((tile, index) => (
          <Hai
            key={index}
            hai={tile}
            size="lg"
            style={{
              width: calculatedTileWidth,
              height: calculatedTileHeight,
            }}
          />
        ))}
      </View>
    </View>
  );
}
