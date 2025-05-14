import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import { Link } from 'expo-router';
import { SafeView } from '@/components/ui/SafeView';
import * as ExpoLocation from 'expo-location';
import RevealScreen from '@/screens/RevealScreen';
import {ThemedText, ThemedView} from '@/components/ui/themed';
import {useSpeciesStore} from '@/context/zustand/strore/useSpeciesStore';
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
            <SafeView disableBottomInset>
                    <ThemedText>Saving your capture...</ThemedText>
            </SafeView>
        );
    }

    if (error) {
        return (
            <SafeView disableBottomInset>
                <ThemedText>Error: {error}</ThemedText>
            </SafeView>
        );
    }
    console.log('specie', specie);
    console.log('capturedImageUri', capturedImageUri);
    if (!specie || !capturedImageUri) {
        return (
            <SafeView disableBottomInset>
                <ThemedView>
                    <ThemedText>No species or image selected</ThemedText>
                    <Link href="/(home)" asChild>
                        <ThemedText>Go back</ThemedText>  
                    </Link>
                </ThemedView>
            </SafeView>
        );
    }

    return <RevealScreen specie={specie} />;
}

