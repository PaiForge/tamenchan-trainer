import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import {
  SettingsProvider,
  useSettings,
} from "../features/settings/SettingsContext";
import { initI18n } from "../i18n";

function ThemeRoot() {
  const { theme } = useSettings();
  const themeClass = theme === "green" ? "theme-green" : "";

  return (
    <View style={{ flex: 1 }} className={themeClass}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme === "green" ? "#166534" : "#1f2937",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#fff",
          },
          contentStyle: {
            // We'll handle background in each screen using semantic classes,
            // but setting a default match is good practice.
            backgroundColor: theme === "green" ? "#14532d" : "#111827",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ title: "Training" }} />
      </Stack>
      <StatusBar style="light" />
    </View>
  );
}

/**
 *
 */
export default function RootLayout() {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n()
      .then(() => {
        setI18nInitialized(true);
      })
      .catch((error: unknown) => {
        console.error("Failed to initialize i18n:", error);
        setI18nInitialized(true);
      });
  }, []);

  if (!i18nInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SettingsProvider>
      <ThemeRoot />
    </SettingsProvider>
  );
}
