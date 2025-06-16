import React from 'react';
import { StyleSheet, Button, ViewStyle, StyleProp ,ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView,ThemedText } from '../ui/themed';

interface ErrorMessageProps {
    refresh?: () => void;
    onReturn?: () => void;
    style?: StyleProp<ViewStyle>;
    message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    refresh,
    onReturn,
    style,
    message = 'Une erreur est survenue.'
}) => (
    <ThemedView style={[styles.errorContainer, style]}>
        <ThemedView style={styles.errorContent}>
            <Ionicons name="warning-outline" size={64} color="red" />
            <ScrollView style={styles.scroll}>
                <ThemedText style={styles.errorText}>{message}</ThemedText>
            </ScrollView>
            <ThemedView style={styles.buttonContainer}>
                {refresh && (
                    <Button title="Réessayer" onPress={refresh} color="red"/>
                )}
                {onReturn && (
                    <Button title="Retour" onPress={onReturn} color="red"/>
                )}
            </ThemedView>
        </ThemedView>
    </ThemedView>
);

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorContent: {
        alignItems: 'center',
        backgroundColor: '#fff0f0',
        borderRadius: 12,
        gap:20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    scroll:{
        flexGrow:0,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    }
});