import React from "react";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/**
 *
 */
export function CustomBackButton() {
  return (
    <Pressable
      onPress={() => {
        router.replace("/");
      }}
      className="ml-2 p-1"
    >
      <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
    </Pressable>
  );
}
