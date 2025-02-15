import {ThemedText} from "@/components/ui/themed/ThemedText";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import SpeciesDetailScreen from "@/screens/SpeciesDetailScreen";
import {useLocalSearchParams} from "expo-router";
import {useGetById} from "@/hooks/viewModels/useGetById";
import StubData from "@/dal/StubLib/StubData";
import Capture from "@/model/domain/Capture";
import Specie from "@/model/domain/Specie";

export default function details() {
    const {specieId,capturedId} = useLocalSearchParams();
    const captureId = typeof capturedId === 'string' ? parseInt(capturedId) : NaN;
    const specieId2 = typeof specieId === 'string' ? parseInt(specieId) : NaN;
    // Vérification : Si `id` est absent ou invalide
    if (isNaN(specieId2)) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>Paramètre `id` manquant ou invalide !</ThemedText>
            </ThemedView>
        );
    }
    const { captureRepository , speciesRepository} = StubData.getInstance();

    if(!captureRepository) {
        throw new Error("captureRepository not found!");
    }
    if(!speciesRepository) {
        throw new Error("speciesRepository not found!");
    }
    const { item: capture,isLoading:isCaptureLoading,error:errorCapture} = useGetById<Capture>(captureId,captureRepository);
    const { item:specie,isLoading: isSpecieLoading,error:errorSpecie} = useGetById<Specie>(specieId2,speciesRepository);

    if (!specie) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText type={'subtitle'}>Espèce introuvalble...</ThemedText>
            </ThemedView>
        );
    }
    const isLoading = (specie && isSpecieLoading) || (capture && isCaptureLoading);

    return (
        <SpeciesDetailScreen specie={specie} capture={capture} isLoading={isLoading || isSpecieLoading}/>
    );
}