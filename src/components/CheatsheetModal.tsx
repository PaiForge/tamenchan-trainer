import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Hai } from 'mahjong-react-ui';
import type { HaiKindId } from '@pai-forge/riichi-mahjong';

interface CheatsheetModalProps {
    visible: boolean;
    onClose: () => void;
    correctWaits: HaiKindId[];
}

export function CheatsheetModal({ visible, onClose, correctWaits }: CheatsheetModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>正解（待ち牌）</Text>

                    <View style={styles.tilesContainer}>
                        {correctWaits.map((tile, index) => (
                            <Hai key={index} hai={tile} size="lg" />
                        ))}
                    </View>

                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={onClose}
                    >
                        <Text style={styles.textStyle}>閉じる</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#1f2937', // gray-800
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24,
    },
    tilesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        marginBottom: 32,
    },
    button: {
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        minWidth: 120,
    },
    buttonClose: {
        backgroundColor: '#374151', // gray-700
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});
