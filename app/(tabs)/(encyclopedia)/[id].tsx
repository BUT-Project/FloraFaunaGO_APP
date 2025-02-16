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

    // Get repositories
    const stubData = StubData.getInstance();
    const captureRepository = stubData?.captureRepository ?? null;
    const speciesRepository = stubData?.speciesRepository ?? null;

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


    // Vérification des paramètres
    if (isNaN(specieId2)) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>Paramètre `id` manquant ou invalide !</ThemedText>
            </ThemedView>
        );
    }

    if (!captureRepository || !speciesRepository) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>Erreur de configuration des repositories</ThemedText>
            </ThemedView>
        );
    }



    // Gestion des erreurs
    if (errorSpecie || errorCapture) {
        errorSpecie && alert(errorSpecie)
        errorCapture && alert(errorCapture)
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText type={'subtitle'}>
                    {errorSpecie?.message || "Erreur lors de la récupération de l'espèce"}
                    {errorCapture?.message || "Erreur lors de la récupération de la capture"}
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