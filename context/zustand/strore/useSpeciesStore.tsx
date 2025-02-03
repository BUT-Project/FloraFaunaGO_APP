import Specie from "@/model/domain/Specie";
import {create} from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import { devtools } from 'zustand/middleware';

export interface SpeciesState {
    // State
    currentImageUri: string | null;
    identifiedSpecies: Specie | null;
    isLoading: boolean;
    error: Error | null;

    // Actions
    setCurrentImageUri: (image: string) => void;
    setCurrentIdentifiedSpecies: (species: Specie) => void;
    captureSpecies: () => void;
    resetState: () => void;
}


const initialState = {
    currentImage: null,
    identifiedSpecies: null,
    isLoading: false,
    error: null,
};

export const useSpeciesStore = create<SpeciesState>()(
    devtools(
        (set, get) => ({
            ...initialState,

            setCurrentImage: (image: string) => {
                set({
                    currentImageUri: image,
                    error: null,
                });
            },

            setCurrentIdentifiedSpecies: async (specie : Specie) => {
                const { currentImageUri } = get();
                if (!currentImageUri) {
                    set({ error: new Error('Aucune image sélectionnée') });
                    return;
                }
                set({
                    identifiedSpecies: specie,
                });
            },

            resetState: () => {
                set(initialState);
            },

            setCurrentImageUri: (image: string) => {
                set({
                    currentImageUri: image,
                    error: null,
                });
            }
        }),
        {
            name: 'species-store',
            enabled: process.env.NODE_ENV === 'development',
        }
    )
);
