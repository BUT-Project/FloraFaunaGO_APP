import React from "react";
import SpeciesDetailScreen from "@/screens/SpeciesDetailScreen";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useGetById} from "@/hooks/viewModels/useGetById";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {Capture,Specie} from "@/model/domain";
import Loading from "@/components/ui/Loading";
import ErrorBoundary from "@/components/ErrorBoundary";
import {AppFacadeService} from "@/services/AppFacadeService";
import { SafeView } from "@/components/ui/SafeView";

export default function SpeciesDetailsPage() {

    const {specieId, capturedId} = useLocalSearchParams();
    const captureId = typeof capturedId === 'string' ? capturedId : null;
    const validSpecieId = typeof specieId === 'string' ? specieId : null;
    const router = useRouter();

    const onReturn = () => router.back();
    const dataManager = AppFacadeService.getInstance().dataManager;
    const captureRepository = dataManager?.captureRepository ?? null;
    const speciesRepository = dataManager?.speciesRepository ?? null;

    const {
        item: capture,
        isLoading: isCaptureLoading,
        error: captureError
    } = useGetById<Capture>(captureId, captureRepository);

    const {
        item: specie,
        isLoading: isSpecieLoading,
        error: specieError
    } = useGetById<Specie>(validSpecieId, speciesRepository);

    if (!validSpecieId) {
        return (
        <SafeView disableBottomInset>
            <ErrorMessage message="Paramètre `id` manquant ou invalide !" onReturn={onReturn} />;
        </SafeView>);
    }

    if (!captureRepository || !speciesRepository) {
        return <ErrorMessage message="Erreur de configuration des repositories..." onReturn={onReturn}/>;
    }

    if (specieError || captureError) {
        const errorMessages: string[] = [];

        if (captureError) {
            const captureMessage = captureError.message ? `Erreur lors de la récupération de la capture :\n${captureError.message}` 
                : `Erreur lors de la récupération de la capture :\n${String(captureError)}`;
            errorMessages.push(captureMessage);
        }

        if (specieError) {
            const specieMessage = specieError.message? `Erreur lors de la récupération de l'espèce :\n${specieError.message}` 
                : `Erreur lors de la récupération de l'espèce :\n${String(specieError)}`;
            errorMessages.push(specieMessage);
        }

        return (
            <SafeView disableBottomInset>
                <ErrorMessage message={errorMessages.join('\n\n')} onReturn={onReturn} />
            </SafeView>
        );
    }

    if (isSpecieLoading || isCaptureLoading) {
        return <Loading disableBottomInset text="Chargement des données..." />;
    }

    if (!specie) {
        return <ErrorMessage message="Espèce introuvable..." />;
    }

    return (
        <ErrorBoundary page="Détail de l'espèce">
            <SpeciesDetailScreen specie={specie} capture={capture}/>
        </ErrorBoundary>
    );
}