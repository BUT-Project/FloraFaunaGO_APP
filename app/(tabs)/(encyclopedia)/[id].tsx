import {ThemedText} from "@/components/ui/themed/ThemedText";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import SpeciesDetailScreen from "@/screens/SpeciesDetailScreen";
import {useLocalSearchParams} from "expo-router";
import {useGetById} from "@/hooks/viewModels/useGetById";
import StubData from "@/dal/StubLib/StubData";
import Capture from "@/model/domain/Capture";
import Specie from "@/model/domain/Specie";
import {SafeView} from "@/components/ui/SafeView";
import React from "react";
import {ActivityIndicator} from "react-native";

export default function Details() {
    const {specieId, capturedId} = useLocalSearchParams();
    const captureId = typeof capturedId === 'string' ? parseInt(capturedId) : NaN;
    const specieId2 = typeof specieId === 'string' ? parseInt(specieId) : NaN;

    // Vérification des paramètres
    if (isNaN(specieId2)) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>Paramètre `id` manquant ou invalide !</ThemedText>
            </ThemedView>
        );
    }

    const { captureRepository, speciesRepository } = StubData.getInstance();

    if (!captureRepository || !speciesRepository) {
        if(!captureRepository) {
            throw new Error("captureRepository not found!");
        }
        if(!speciesRepository) {
            throw new Error("speciesRepository not found!");
        }
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>Erreur de configuration des repositories</ThemedText>
            </ThemedView>
        );
    }

    const {
        item: capture,
        isLoading: isCaptureLoading,
        error: errorCapture
    } = useGetById<Capture>(captureId, captureRepository);

    const {
        item: specie,
        isLoading: isSpecieLoading,
        error: errorSpecie
    } = useGetById<Specie>(specieId2, speciesRepository);

    const isLoading = isSpecieLoading || isCaptureLoading;

    // Gestion des erreurs
    if (errorSpecie || errorCapture) {
        errorSpecie && alert(errorSpecie)
        errorCapture && alert(errorCapture)
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText type={'subtitle'}>
                    Error
                </ThemedText>
            </ThemedView>
        );
    }

    if (isLoading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'}/>
            </ThemedView>
        );
    }

    if (!specie) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText type={'subtitle'}>Espèce introuvable...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <SafeView>
            <SpeciesDetailScreen
                specie={specie}
                capture={capture}
            />
        </SafeView>
    );
}