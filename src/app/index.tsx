import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SettingsModal } from "../components/SettingsModal";

/**
 *
 */
export default function HomeScreen() {
  const [isSettingsVisible, setSettingsVisible] = useState(false);

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
          Tamenchan
        </Text>
        <Text className="text-2xl text-text-muted tracking-[4px] -mt-1">
          Trainer
        </Text>
      </View>

      <View className="w-full max-w-[300px]">
        <Pressable
          className="bg-primary py-[18px] rounded-xl items-center shadow-lg active:bg-primary-dark active:scale-[0.98]"
          onPress={() => {
            router.push("/game/training");
          }}
        >
          <Text className="text-white text-lg font-bold tracking-widest">
            1112型
          </Text>
        </Pressable>
      </View>

      <SettingsModal
        visible={isSettingsVisible}
        onClose={() => {
          setSettingsVisible(false);
        }}
      />
    </View>
  );
}
