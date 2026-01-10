import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SettingsModal } from "../components/SettingsModal";
import { PatternExplanationModal } from "../components/PatternExplanationModal";
import { pattern13Content } from "@tamenchan-trainer/content";

/**
 *
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [isPattern13HelpVisible, setPattern13HelpVisible] = useState(false);

  return (
    <View className="flex-1 bg-background items-center justify-center p-6 relative">
      {/* Settings Button */}
      <Pressable
        className="absolute top-12 right-6 p-2 rounded-full active:bg-surface"
        onPress={() => {
          setSettingsVisible(true);
        }}
      >
        <Ionicons name="settings-sharp" size={28} color="#9ca3af" />
      </Pressable>

      <View className="items-center mb-16">
        <Text className="text-[42px] font-bold text-text tracking-widest">
          {t("home.title")}
        </Text>
        <Text className="text-2xl text-text-muted tracking-[4px] -mt-1">
          {t("home.subtitle")}
        </Text>
      </View>

      <View className="w-full max-w-[300px]">
        <View className="flex-row items-center gap-3">
          <Pressable
            className="flex-1 bg-primary py-[18px] rounded-xl items-center shadow-lg active:bg-primary-dark active:scale-[0.98]"
            onPress={() => {
              router.push("/game/training");
            }}
          >
            <Text className="text-white text-lg font-bold tracking-widest">
              {t("home.pattern13")}
            </Text>
          </Pressable>

          {/* Help Icon */}
          <Pressable
            className="w-12 h-12 bg-surface rounded-full items-center justify-center border border-border active:bg-surface-hover"
            onPress={() => {
              setPattern13HelpVisible(true);
            }}
          >
            <Ionicons name="help-outline" size={24} color="#9ca3af" />
          </Pressable>
        </View>
      </View>

      <SettingsModal
        visible={isSettingsVisible}
        onClose={() => {
          setSettingsVisible(false);
        }}
      />

      <PatternExplanationModal
        visible={isPattern13HelpVisible}
        onClose={() => {
          setPattern13HelpVisible(false);
        }}
        content={pattern13Content}
      />
    </View>
  );
}
