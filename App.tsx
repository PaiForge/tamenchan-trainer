import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Hai } from 'mahjong-react-ui';
import { HaiKind } from 'riichi-mahjong';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mahjong Training App Setup</Text>
      <View style={styles.tilesContainer}>
        <Hai hai={HaiKind.ManZu1} size="lg" />
        <Hai hai={HaiKind.PinZu1} size="lg" />
        <Hai hai={HaiKind.SouZu1} size="lg" />
        <Hai hai={HaiKind.Ton} size="lg" />
        <Hai hai={HaiKind.ManZu5} size="lg" highlighted />
        <Hai hai={HaiKind.PinZu5} size="lg" rotated />
        <Hai hai={HaiKind.SouZu5} size="lg" selected />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    padding: 16,
  },
});
