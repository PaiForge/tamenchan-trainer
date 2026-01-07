import React, { ReactNode } from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSettings, Theme } from "../features/settings/SettingsContext";

interface BaseModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly children: ReactNode;
  /**
   * テーマを強制的に適用する場合に使用（設定画面のプレビュー用）
   */
  readonly themeOverride?: Theme;
}

/**
 * 共通モーダルコンポーネント
 *
 * テーマ対応の背景とコンテナ、ヘッダー（タイトル・閉じるボタン）を提供します。
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export function BaseModal({
  visible,
  onClose,
  title,
  children,
  themeOverride,
}: Readonly<BaseModalProps>) {
  const { theme: globalTheme } = useSettings();
  const activeTheme = themeOverride ?? globalTheme;
  const themeClass = activeTheme === "green" ? "theme-green" : "";

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className={`flex-1 ${themeClass}`}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill}>
          <Pressable
            className="flex-1 justify-center items-center bg-black/50"
            onPress={onClose}
          >
            <Pressable
              className="w-[340px] bg-surface rounded-2xl p-6 border border-border"
              onPress={(e) => {
                e.stopPropagation();
              }}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-text">
                  {title ?? ""}
                </Text>
                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={24} color="#9ca3af" />
                </Pressable>
              </View>

              {children}
            </Pressable>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
}
