import React from 'react';
import { View } from 'react-native';
import { Hai } from '@pai-forge/mahjong-react-ui';
import { HaiKindId } from '@pai-forge/riichi-mahjong';

interface HandDisplayProps {
    hand: HaiKindId[];
    calculatedTileWidth: number;
    calculatedTileHeight: number;
}

export function HandDisplay({ hand, calculatedTileWidth, calculatedTileHeight }: HandDisplayProps) {
    return (
        <View className="py-5 px-4 bg-gray-800 border-t border-gray-700 items-center">
            <View className="flex-row flex-nowrap justify-center gap-[2px]">
                {hand.map((tile, index) => (
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
