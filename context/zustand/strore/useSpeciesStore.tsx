import Specie from "@/model/domain/Specie";
import {create} from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SpeciesState {
    currentImageUri: string | null;
    identifiedSpecies: Specie | null;
    isLoading: boolean;
    error: Error | null;

    setCurrentImageUri: (image: string) => void;
    setCurrentIdentifiedSpecies: (species: Specie) => void;
    resetState: () => void;
}

const initialState = {
    currentImageUri: null,
    identifiedSpecies: null,
    isLoading: false,
    error: null,
};

export const useSpeciesStore = create<SpeciesState>()(
    devtools(
        (set, get) => ({
            ...initialState,

            setCurrentIdentifiedSpecies: (specie: Specie) => {
                const { currentImageUri } = get();
                
                if (!currentImageUri) {
                    set((state) => ({
                        ...state,
                        error: new Error('Aucune image sélectionnée')
                    }));
                    return;
                }

                set((state) => ({
                    ...state,
                    identifiedSpecies: specie,
                    error: null
                }));
            },

            setCurrentImageUri: (image: string) => {
                console.log('Setting current image uri:', image);
                set((state) => ({
                    ...state,
                    currentImageUri: image,
                    error: null
                }));
                const { currentImageUri } = get();
                console.log('Current identified species:', currentImageUri);
            },

            resetState: () => {
                set(initialState);
            }
        })
    )
);