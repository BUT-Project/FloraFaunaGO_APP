import { useEffect, useState } from 'react';
import StubData from "@/dal/StubLib/StubData";
import RevealScreen from "@/screens/RevealScreen";
import { useLocalSearchParams } from "expo-router";
import {ThemedText} from "@/components/ui/themed/ThemedText";

export default function Reveal() {
    const { specieId } = useLocalSearchParams<{ specieId: string }>();
    const [specie, setSpecie] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSpecie() {
            try {
                const { speciesRepository } = StubData.getInstance();
                if (specieId && speciesRepository) {
                    const fetchedSpecie = await speciesRepository.getById(specieId);
                    console.log('fetchedSpecie', fetchedSpecie);

                    setSpecie(fetchedSpecie);
                }
            } catch (error) {
                console.error('Error fetching specie:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSpecie();
    }, [specieId]);

    if (isLoading) {
        return <ThemedText>Loading...</ThemedText>; // Or your loading component
    }

    if (!specie) {
        return <ThemedText>Species not found</ThemedText>; // Or your error component
    }

    // here we should make an API call to get add a capture

    return <RevealScreen specie={specie} />;
}