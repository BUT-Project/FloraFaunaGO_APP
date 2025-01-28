import Specie from "@/model/domain/Specie";
import {useCallback, useEffect, useState} from "react";
import {CameraType, useCameraPermissions} from "expo-camera";
import Habitat from "@/model/domain/Habitat";
import {Climate} from "@/model/domain/Climate";
import {Diet} from "@/model/domain/Diet";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";
import Location from "@/model/domain/Location";

export function useCamera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    async function requestPerm(){
        await requestPermission()
    }

    const toggleCameraFacing = useCallback(() => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }, []);

    return {facing, toggleCameraFacing, permission,requestPerm};
};



export function useSpeciesIdentificationMock() {
    const [identifiedSpecies, setIdentifiedSpecies] = useState<Specie | null>(null);

    const identifySpecies = useCallback((imageUri: string) => {
        setTimeout(() => {
            const location1: Location = new Location(13.33,19.09,3, 5, 1); // Desert Tchad
            const specie1 = new Specie(1, 'Lion', 'Panthera leo', "Le Lion (Panthera leo) est une espèce de mammifères carnivores de la famille des Félidés. La femelle du lion est la lionne, son petit est le lionceau. Le mâle adulte, aisément reconnaissable à son importante crinière, accuse une masse moyenne qui peut être variable selon les zones géographiques où il se trouve, allant de 145 à 180 kg pour les lions d'Asie à plus de 225 kg pour les lions d'Afrique.", new Habitat('jungle', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Felidae, [location1, location1], 'https://upload.wikimedia.org/wikipedia/commons/6/6f/011_The_lion_king_Tryggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg');

            setIdentifiedSpecies(specie1);
        }, 1500);
    }, []);

    return {identifiedSpecies, identifySpecies};
};
