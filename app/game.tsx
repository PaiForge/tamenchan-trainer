import { StyleSheet, Text, View } from 'react-native';
import { Hai } from 'mahjong-react-ui';
import { HaiKind } from '@pai-forge/riichi-mahjong';

export default function GameScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Screen</Text>
            <View style={styles.tilesContainer}>
                <Hai hai={HaiKind.ManZu1} size="lg" />
                <Hai hai={HaiKind.PinZu1} size="lg" />
                <Hai hai={HaiKind.SouZu1} size="lg" />
                <Hai hai={HaiKind.Ton} size="lg" />
                <Hai hai={HaiKind.ManZu5} size="lg" highlighted />
                <Hai hai={HaiKind.PinZu5} size="lg" rotated />
                <Hai hai={HaiKind.SouZu5} size="lg" selected />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827', // gray-900
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    tilesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        padding: 16,
    },
});
