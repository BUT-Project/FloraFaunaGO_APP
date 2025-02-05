import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ExpoLocation from 'expo-location';

import StubData from '@/dal/StubLib/StubData';
import RevealScreen from '@/screens/RevealScreen';
import { ThemedText } from '@/components/ui/themed/ThemedText';
import CaptureDetail from '@/model/domain/CaptureDetail';
import Capture from '@/model/domain/Capture';
import Location from '@/model/domain/Location';
import { useSpeciesStore } from '@/context/zustand/strore/useSpeciesStore';

export default function Reveal() {
    const { currentImageUri: capturedImageUri, identifiedSpecies: specie } = useSpeciesStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function saveCapture() {
            if (!specie || !capturedImageUri) return;

            setIsLoading(true);
            setError(null);

            try {
                const { captureRepository } = StubData.getInstance();

                if (!captureRepository) {
                    throw new Error('Missing capture repository');
                }

                // Request location permissions
                const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    throw new Error('Location permission is required to save your capture');
                }

                // Get current location
                const currentLocation = await getCurrentLocation();

                // Create capture detail
                const captureDetail = new CaptureDetail(
                    Date.now(),
                    new Date(),
                    false, // Default shiny value [TODO]
                    currentLocation
                );

                // Create and save the capture
                const newCapture = new Capture(
                    Date.now(),
                    capturedImageUri,
                    specie,
                    [captureDetail]
                );

                await captureRepository.create(newCapture);

                if (isMounted) {
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

    async function getCurrentLocation(): Promise<Location> {
        try {
            const location = await ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.Balanced,
            });

            return new Location(
                location.coords.latitude,
                location.coords.longitude,
                location.coords.altitude ?? 0,
                20,
                location.coords.accuracy ?? 0
            );
        } catch (error) {
            console.error('Error getting location:', error);
            throw new Error('Failed to get your current location');
        }
    }

    if (isLoading) {
        return (
            <SafeAreaView>
                <ThemedText>Saving your capture...</ThemedText>
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
                <ThemedText>No species or image selected</ThemedText>
            </SafeAreaView>
        );
    }

    return <RevealScreen specie={specie} />;
}