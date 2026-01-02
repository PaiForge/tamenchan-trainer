import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

/**
 *
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tamenchan</Text>
        <Text style={styles.subtitle}>Trainer</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={() => { router.push("/game/training"); }}
        >
          <Text style={styles.startButtonText}>Start Training</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827", // gray-900
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 64, // Increased spacing since decoration is gone
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 24,
    color: "#9ca3af", // gray-400
    letterSpacing: 4,
    marginTop: -4,
  },
  actions: {
    width: "100%",
    maxWidth: 300,
  },
  startButton: {
    backgroundColor: "#0d9488", // teal-600
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  startButtonPressed: {
    backgroundColor: "#0f766e", // teal-700
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
