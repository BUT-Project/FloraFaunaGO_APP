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
import {useAuthStore} from "@/context/zustand/strore/useAuthStore";
import Specie from "@/model/domain/Specie";
import Habitat from "@/model/domain/Habitat";
import {Climate} from "@/model/domain/Climate";
import {Diet} from "@/model/domain/Diet";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import getCurrentLocation from "@/libs/expo-location/index.ts";

export default function Reveal() {
    const specie = useSpeciesStore((state) => state.identifiedSpecies);
    const capturedImageUri = useSpeciesStore((state) => state.currentImageUri);
    //const saveCapture = useSpeciesStore((state) => state.);
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
        console.log(`The missing one is ${!capturedImageUri ? "capturedImageUri" :"specie"} ${capturedImageUri} ¶ ${specie}`);
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