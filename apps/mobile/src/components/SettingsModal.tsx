import React from "react";
import { View, Text, Pressable } from "react-native";
import { useSettings } from "../features/settings/SettingsContext";
import { HaiType } from "@pai-forge/riichi-mahjong";
import { BaseModal } from "./BaseModal";

interface SettingsModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * 設定画面のモーダルコンポーネント
 */
export function SettingsModal({
  visible,
  onClose,
}: Readonly<SettingsModalProps>) {
  const { theme, setTheme, preferredSuit, setPreferredSuit } = useSettings();

  // Local state for explicit save and preview
  const [tempTheme, setTempTheme] = React.useState(theme);
  const [tempSuit, setTempSuit] = React.useState(preferredSuit);

  // Sync with actual settings when modal opens
  React.useEffect(() => {
    if (visible) {
      setTempTheme(theme);
      setTempSuit(preferredSuit);
    }
  }, [visible, theme, preferredSuit]);

  const handleSave = () => {
    void setTheme(tempTheme);
    void setPreferredSuit(tempSuit);
    onClose();
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="設定"
      themeOverride={tempTheme}
    >
      {/* Theme Settings */}
      <View className="mb-8">
        <Text className="text-text-muted mb-3 font-bold">テーマ</Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => {
              setTempTheme("navy");
            }}
            className={`flex-1 py-3 px-4 rounded-xl border-2 ${
              tempTheme === "navy"
                ? "bg-primary/20 border-primary"
                : "bg-transparent border-gray-600"
            } items-center`}
          >
            <View className="w-6 h-6 rounded-full bg-[#111827] border border-gray-600 mb-2" />
            <Text
              className={
                tempTheme === "navy"
                  ? "text-primary font-bold"
                  : "text-gray-400"
              }
            >
              Navy
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setTempTheme("green");
            }}
            className={`flex-1 py-3 px-4 rounded-xl border-2 ${
              tempTheme === "green"
                ? "bg-primary/20 border-primary"
                : "bg-transparent border-gray-600"
            } items-center`}
          >
            <View className="w-6 h-6 rounded-full bg-[#14532d] border border-gray-600 mb-2" />
            <Text
              className={
                tempTheme === "green"
                  ? "text-primary font-bold"
                  : "text-gray-400"
              }
            >
              Green
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Suit Settings */}
      <View className="mb-8">
        <Text className="text-text-muted mb-3 font-bold">問題に用いる数牌</Text>
        <View className="flex-row flex-wrap gap-2">
          {(
            ["random", HaiType.Manzu, HaiType.Pinzu, HaiType.Souzu] as const
          ).map((suit) => {
            const isSelected = tempSuit === suit;
            const labels: Record<string, string> = {
              random: "ランダム",
              [HaiType.Manzu]: "萬子",
              [HaiType.Pinzu]: "筒子",
              [HaiType.Souzu]: "索子",
            };
            return (
              <Pressable
                key={suit}
                onPress={() => {
                  setTempSuit(suit);
                }}
                className={`py-2 px-3 rounded-lg border ${
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-transparent border-gray-600"
                }`}
              >
                <Text
                  className={
                    isSelected ? "text-white font-bold" : "text-gray-400"
                  }
                >
                  {labels[suit]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Save Button */}
      <Pressable
        className="bg-primary py-3 rounded-xl items-center active:bg-primary-dark"
        onPress={handleSave}
      >
        <Text className="text-white font-bold text-lg">設定を保存</Text>
      </Pressable>
    </BaseModal>
  );
}
