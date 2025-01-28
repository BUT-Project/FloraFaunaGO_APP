import { useEffect, useState } from 'react';
import StubData from "@/dal/StubLib/StubData";
import RevealScreen from "@/screens/RevealScreen";
import { useLocalSearchParams } from "expo-router";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import CaptureDetail from "@/model/domain/CaptureDetail";
import Capture from "@/model/domain/Capture";
import Location from "@/model/domain/Location";
import * as ExpoLocation from "expo-location";
export default function Reveal() {
    const { specieId,imageUri } = useLocalSearchParams<{ specieId: string, imageUri: string }>();
    const [specie, setSpecie] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSpecie() {
            try {
                const { speciesRepository, captureRepository } = StubData.getInstance();
                if (!specieId || !speciesRepository || !captureRepository) {
                    throw new Error('Missing required data');
                }
                const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    throw new Error('Location permission not granted');
                }
                if (specieId && speciesRepository) {
                    const fetchedSpecie = await speciesRepository.getById(specieId);
                    console.log('fetchedSpecie', fetchedSpecie);

                    setSpecie(fetchedSpecie);

                    const currentLocation = await getCurrentLocation(); // You'll need to implement this
                    const captureDetail = new CaptureDetail(
                        Date.now(), // Using timestamp as temporary ID
                        new Date(),
                        false, // Default shiny value
                        currentLocation
                    );

                    // Create the capture
                    const newCapture = new Capture(
                        Date.now(), // Using timestamp as temporary ID
                        imageUri,
                        fetchedSpecie,
                        [captureDetail]
                    );
                    // Save the capture
                    await captureRepository?.create(newCapture);
                }
            } catch (error) {
                console.error('Error fetching specie:', error);
            } finally {
                setIsLoading(false);
            }
        }


        fetchSpecie();
    }, [specieId]);
    async function getCurrentLocation(): Promise<Location> {
        try {
            const location = await ExpoLocation.getCurrentPositionAsync();

            return new Location(
                location.coords.latitude,
                location.coords.longitude,
                location.coords.altitude || 0,
                20, // Default radius in meters - adjust as needed
                location.coords.accuracy || 0
            );
        } catch (error) {
            console.error('Error getting location:', error);
            // Return a default location if unable to get current location
            return new Location(0, 0, 0, 20, 0);
        }
    }


    if (isLoading) {
        return <ThemedText>Loading...</ThemedText>; // Or your loading component
    }

    if (!specie) {
        return <ThemedText>Species not found</ThemedText>; // Or your error component
    }

    // here we should make an API call to get add a capture

    return <RevealScreen specie={specie} />;
}