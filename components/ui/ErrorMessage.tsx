import React from 'react';
import { StyleSheet, Button, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView,ThemedText } from '../ui/themed';

interface ErrorMessageProps {
    refresh?: () => void;
    style?: StyleProp<ViewStyle>;
    message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    refresh,
    style,
    message = 'Une erreur est survenue.'
}) => (
    <ThemedView style={[styles.errorContainer, style]}>
        <ThemedView style={styles.errorContent}>
            <Ionicons name="warning-outline" size={64} color="red" />
            <ThemedText style={styles.errorText}>{message}</ThemedText>
            {refresh && (
                <Button title="Réessayer" onPress={refresh} color="red" />
            )}
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
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        marginVertical: 16,
        textAlign: 'center',
    },
});