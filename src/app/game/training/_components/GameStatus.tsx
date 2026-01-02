import React from 'react';
import { View, Text } from 'react-native';

interface GameStatusProps {
    isCorrect: boolean | null;
}

export function GameStatus({ isCorrect }: GameStatusProps) {
    return (
        <View className="h-[60px] justify-center items-center mb-5">
            {isCorrect === true && (
                <Text className="text-emerald-400 text-2xl font-bold">正解！</Text>
            )}
            {isCorrect === false && (
                <Text className="text-red-400 text-2xl font-bold">不正解...</Text>
            )}
        </View>
    );
}
