import React from "react";
import {ThemedText,ThemedView} from "@/components/ui/themed";
import SpeciesDetailScreen from "@/screens/SpeciesDetailScreen";
import {useLocalSearchParams} from "expo-router";
import {useGetById} from "@/hooks/viewModels/useGetById";
import StubData from "@/dal/StubLib/StubData";
import Capture from "@/model/domain/Capture";
import Specie from "@/model/domain/Specie";
import Loading from "@/components/ui/Loading";

const CenteredMessage = ({ children }: { children: React.ReactNode }) => (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {children}
    </ThemedView>
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
        return <Loading text="Chargement des données..." />;
    }

    if (!specie) {
        return <ErrorView message="Espèce introuvable..." />;
    }

    return (
            <SpeciesDetailScreen
                specie={specie}
                capture={capture}
            />
    );
}