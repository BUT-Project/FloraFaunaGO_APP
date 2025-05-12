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

const CenteredMessage = ({ children }: { children: React.ReactNode }) => (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {children}
    </ThemedView>
);

const LoadingView = () => (
    <CenteredMessage>
        <ActivityIndicator size={'large'}/>
    </CenteredMessage>
);

const ErrorView = ({ message }: { message: string }) => (
    <CenteredMessage>
        <ThemedText type={'subtitle'}>{message}</ThemedText>
    </CenteredMessage>
);

export default function Details() {
    const {specieId, capturedId} = useLocalSearchParams();
    const captureId = typeof capturedId === 'string' ? parseInt(capturedId) : NaN;
    const specieId2 = typeof specieId === 'string' ? parseInt(specieId) : NaN;

    const stubData = StubData.getInstance();
    const repositories = {
        capture: stubData?.captureRepository ?? null,
        species: stubData?.speciesRepository ?? null
    };

    const {
        item: capture,
        isLoading: isCaptureLoading,
        error: errorCapture
    } = useGetById<Capture>(captureId, repositories.capture);

    const {
        item: specie,
        isLoading: isSpecieLoading,
        error: errorSpecie
    } = useGetById<Specie>(specieId2, repositories.species);

    if (isNaN(specieId2)) {
        return <ErrorView message="Paramètre `id` manquant ou invalide !" />;
    }

    if (!repositories.capture || !repositories.species) {
        return <ErrorView message="Erreur de configuration des repositories" />;
    }

    if (errorSpecie || errorCapture) {
        const errorMessage = [
            errorSpecie?.message || "Erreur lors de la récupération de l'espèce",
            errorCapture?.message || "Erreur lors de la récupération de la capture"
        ].join(' ');

        errorSpecie && alert(errorSpecie);
        errorCapture && alert(errorCapture);

        return <ErrorView message={errorMessage} />;
    }

    if (isSpecieLoading || isCaptureLoading) {
        return <LoadingView />;
    }

    if (!specie) {
        return <ErrorView message="Espèce introuvable..." />;
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