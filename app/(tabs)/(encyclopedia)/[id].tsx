import { ThemedText } from "@/components/ui/themed/ThemedText";
import { ThemedView } from "@/components/ui/themed/ThemedView";
import SpeciesDetailScreen from "@/screens/SpeciesDetailScreen";
import {useLocalSearchParams} from "expo-router";

export default function details() {
    const {id} = useLocalSearchParams();
    const captureId = typeof id === 'string' ? parseInt(id) : NaN;

    // Vérification : Si `id` est absent ou invalide
    if (isNaN(captureId)) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>Paramètre `id` manquant ou invalide !</ThemedText>
            </ThemedView>
        );
    }
    return (
        <SpeciesDetailScreen captureId={captureId} />
    );
}