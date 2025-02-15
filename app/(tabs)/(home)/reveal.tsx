import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ExpoLocation from 'expo-location';
import RevealScreen from '@/screens/RevealScreen';
import { ThemedText } from '@/components/ui/themed/ThemedText';

import { useSpeciesStore } from '@/context/zustand/strore/useSpeciesStore';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import getCurrentLocation from "@/libs/expo-location/index.ts";

export default function Reveal() {
    const specie = useSpeciesStore((state) => state.identifiedSpecies);
    const capturedImageUri = useSpeciesStore((state) => state.currentImageUri);
    const addSpecieToUser = useSpeciesStore((state) => state.addSpecieToUser);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function saveCapture() {
            if (!specie || !capturedImageUri) return;

            setIsLoading(true);
            setError(null);

            try {
                // Request location permissions
                const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    throw new Error('Location permission is required to save your capture');
                }

                // Get current location
                if (isMounted) {
                    const currentLocation = await getCurrentLocation();
                    await addSpecieToUser(specie, currentLocation)
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error saving capture:', error);
                if (isMounted) {
                    setIsLoading(false);
                    setError(error instanceof Error ? error.message : 'An unexpected error occurred');
                    Alert.alert(
                        'Error',
                        'Failed to save capture. Please try again.',
                        [{ text: 'OK' }]
                    );
                }
            }
        }

        saveCapture();

        return () => {
            isMounted = false;
        };
    }, [specie, capturedImageUri]);

    if (isLoading) {
        return (
            <SafeAreaView>
                <ThemedView>
                    <ThemedText>Saving your capture...</ThemedText>
                </ThemedView>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView>
                <ThemedText>Error: {error}</ThemedText>
            </SafeAreaView>
        );
    }

    if (!specie || !capturedImageUri) {
        return (
            <SafeAreaView>
                <ThemedView>
                    <ThemedText>No species or image selected</ThemedText>
                </ThemedView>
            </SafeAreaView>
        );
    }

    return <RevealScreen specie={specie} />;
}