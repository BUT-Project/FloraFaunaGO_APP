import React from 'react';
import {useRouter} from "expo-router";
import {useSpeciesStore} from "@/context/zustand/store/useSpeciesStore";
import CaptureScreen from '@/screens/CaptureScreen';


export default function Capture() {
    const imageUri = useSpeciesStore((state) => state.currentImageUri);
    const identifiedSpecies = useSpeciesStore((state) => state.identifiedSpecies);
    const { resetState } = useSpeciesStore();

    console.log("specie",identifiedSpecies)
    const router = useRouter();

    const onResult = (Success:Boolean) => {
        if (Success) {
            router.replace({pathname: '/(tabs)/(home)/reveal',})
        } else 
            onCancel();
    };

    const onCancel = () => {
        resetState();
        router.replace({pathname: '/(tabs)/(home)',})  
    }
    
    return (<CaptureScreen animalPhoto={imageUri} onResult={onResult} onCancel={onCancel}/>)
};