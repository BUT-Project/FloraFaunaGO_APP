import React from "react";
import SpeciesDetailScreen from "@/screens/SpeciesDetailScreen";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useGetById} from "@/hooks/viewModels/useGetById";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import StubData from "@/dal/StubLib/StubData";
import {Capture,Specie} from "@/model/domain";
import Loading from "@/components/ui/Loading";

export default function Details() {

    const {specieId, capturedId} = useLocalSearchParams();
    const captureId = typeof capturedId === 'string' ? capturedId : null;
    const specieId2 = typeof specieId === 'string' ? specieId : null;
    const router = useRouter();

    const onReturn = () => router.back();
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

    if (!specieId2) {
        return <ErrorMessage message="Paramètre `id` manquant ou invalide !" onReturn={onReturn} />;
    }

    if (!repositories.capture || !repositories.species) {
        return <ErrorMessage message="Erreur de configuration des repositories..." onReturn={onReturn}/>;
    }

    if (errorSpecie || errorCapture) {
        const errorMessage = [
            errorCapture?.message || (errorCapture ? String(errorCapture) : "Erreur lors de la récupération de la capture :\n"),
            errorSpecie?.message || (errorSpecie ? String(errorSpecie) : "Erreur lors de la récupération de l'espèce\n"),
        ].join(' ');
        return <ErrorMessage message={errorMessage} onReturn={onReturn} />;
    }

    if (isSpecieLoading || isCaptureLoading) {
        return <Loading text="Chargement des données..." />;
    }

    if (!specie) {
        return <ErrorMessage message="Espèce introuvable..." />;
    }

    return (
            <SpeciesDetailScreen
                specie={specie}
                capture={capture}
            />
    )
}