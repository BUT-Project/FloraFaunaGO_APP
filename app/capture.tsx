import React from 'react';
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {useRouter} from "expo-router";
import {useSpeciesStore} from "@/context/zustand/strore/useSpeciesStore";
import CaptureScreen from '@/screens/CaptureScreen';
import { SafeView } from '@/components/ui/SafeView';

export default function Capture() {
    const imageUri = useSpeciesStore((state) => state.currentImageUri);
    const identifiedSpecies = useSpeciesStore((state) => state.identifiedSpecies);
    const { resetState } = useSpeciesStore();

    console.log("specie",identifiedSpecies)
    const router = useRouter();

    const onResult = (Success:Boolean) => {
        if (Success) {
            router.replace({pathname: '/(tabs)/(home)/reveal',})
        } else {
            resetState();
            router.back();
        }
    };

    const onCancel = () => {
        try{
            resetState();
            router.back()

        }
        catch(error){
            console.error('Error resetting state:', error);
        }   
    }

    if(!imageUri) {
        return (
            <SafeView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ThemedText>No image captured</ThemedText>
            </SafeView>
        );
    }
    
    return (<CaptureScreen animalPhoto={imageUri} onResult={onResult} onCancel={onCancel}/>)
};