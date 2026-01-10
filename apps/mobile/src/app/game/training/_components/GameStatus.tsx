import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

interface GameStatusProps {
  readonly isCorrect: boolean | null;
}

/**
 *
 */
export function GameStatus({ isCorrect }: Readonly<GameStatusProps>) {
  const { t } = useTranslation();

  return (
    <View className="h-[60px] justify-center items-center mb-5">
      {isCorrect === true && (
        <Text className="text-emerald-400 text-2xl font-bold">
          {t("training.correct")}
        </Text>
      )}
      {isCorrect === false && (
        <Text className="text-red-400 text-2xl font-bold">
          {t("training.incorrect")}
        </Text>
      )}
    </View>
  );
}
