import {useEffect, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { Link } from 'expo-router';
import * as ExpoLocation from 'expo-location';
import {useSpeciesStore} from '@/context/zustand/strore/useSpeciesStore';
import getCurrentLocation from "@/libs/expo-location/index.ts";
import { SafeView } from '@/components/ui/SafeView';
import Loading from '@/components/ui/Loading';
import RevealScreen from '@/screens/RevealScreen';
import {ThemedText, ThemedView} from '@/components/ui/themed';

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
        return (<Loading disableBottomInset text="Sauvegarde de votre photo..."/>);
    }

    if (error) {
        return (
            <SafeView disableBottomInset style={styles.container}>
                <ThemedText style={styles.message}>Error: {error}</ThemedText>
                <Link href="/(home)" asChild>
                    <TouchableOpacity style={styles.button}>
                        <ThemedText style={styles.buttonText}>Retour</ThemedText>  
                    </TouchableOpacity>
                </Link>
            </SafeView>
        );
    }
    if (!specie || !capturedImageUri) {
        return (
            <SafeView disableBottomInset style={styles.container}>
                <ThemedView>
                    <ThemedText style={styles.message}>No species or image selected</ThemedText>
                    <Link href="/(home)" asChild>
                        <TouchableOpacity style={styles.button}>
                            <ThemedText style={styles.buttonText}>Retour</ThemedText>  
                        </TouchableOpacity>
                    </Link>
                </ThemedView>
            </SafeView>
        );
    }
    return <RevealScreen specie={specie} />;
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});