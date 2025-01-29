import {useEffect, useState} from 'react';
import StubData from "@/dal/StubLib/StubData";
import RevealScreen from "@/screens/RevealScreen";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import CaptureDetail from "@/model/domain/CaptureDetail";
import Capture from "@/model/domain/Capture";
import Location from "@/model/domain/Location";
import * as ExpoLocation from "expo-location";
import {useSpeciesStore} from "@/context/zustand/strore/useSpeciesStore";


export default function Reveal() {
    const [isLoading, setIsLoading] = useState(true);
    const {currentImageUri: capturedImageUri, identifiedSpecies: specie} = useSpeciesStore();

    useEffect(() => {
        async function fetchSpecie() {
            try {
                const {captureRepository} = StubData.getInstance();
                console.log('fetching specie:', specie);
                if (!specie || !captureRepository) {
                    throw new Error('Missing required data');
                }
                const {status} = await ExpoLocation.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    throw new Error('Location permission not granted');
                }
                const currentLocation = await getCurrentLocation();
                const captureDetail = new CaptureDetail(
                    Date.now(),
                    new Date(),
                    false, // Default shiny value [TOTO]
                    currentLocation
                );

                // Create the capture
                const newCapture = new Capture(
                    Date.now(),
                    capturedImageUri,
                    specie,
                    [captureDetail]
                );
                // Save the capture
                await captureRepository?.create(newCapture);

            } catch (error) {
                console.error('Error fetching specie:', error);
            } finally {
                setIsLoading(false);
            }
        }


        fetchSpecie();
    }, [specie]);

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
            throw new Error('Error getting location');
            // Return a default location if unable to get current location
            // return new Location(0, 0, 0, 20, 0);
        }
    }


    if (isLoading) {
        return <ThemedText>Loading...</ThemedText>; // Or your loading component
    }

    if (!specie) {
        return <ThemedText>Species not found</ThemedText>; // Or your error component
    }

    return <RevealScreen specie={specie}/>;
}