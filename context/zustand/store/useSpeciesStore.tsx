import Specie from "@/model/domain/Specie";
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {useAuthStore} from "@/context/zustand/store/useAuthStore";
import StubData from "@/dal/StubLib/StubData";
import Location from "@/model/domain/Location";
import { SuccessType } from "@/model/domain/SuccessType";
import { processSuccessByType } from "@/shared/successHelper";

export interface SpeciesState {
    currentImageUri: string | null;
    identifiedSpecies: Specie | null;
    isLoading: boolean;
    error: Error | null;

    setCurrentImageUri: (image: string) => void;
    setCurrentIdentifiedSpecies: (species: Specie) => void;

    addSpecieToUser: (specie: Specie, currentLocation : Location) => Promise<void>;

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
                    console.warn("AUCUNE IMAGE SÉLECTIONNÉE");
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
                set((state) => ({
                    ...state,
                    currentImageUri: image,
                    error: null
                }));
            },
            addSpecieToUser: async (specie: Specie, currentLocation : Location) => {
                try {
                    await processSuccessByType(SuccessType.CAPTURE, specie);
                    const { currentImageUri } = get();
                    if (!currentImageUri) {
                        console.log("Aucune image sélectionnée pour l\"ajout à utilisateur Current image uri: " + currentImageUri);
                        set((state) => ({
                            ...state,
                            error: new Error('Aucune image sélectionnée pour l"ajout à utilisateur')
                        }));
                        return;
                    }
                    const authStore = useAuthStore.getState();
                    if (!authStore.isAuthenticated || !authStore.user) {
                        console.error('Utilisateur non authentifié');
                        // [TODO] [Dave] handle error
                        set((state) => ({
                            ...state,
                            error: new Error('Utilisateur non authentifié')
                        }));
                        return;
                    }

                    set((state) => ({ ...state, isLoading: true }));

                    const { captureRepository } = StubData.getInstance();
                    await captureRepository?.addSpecieToUser(authStore.user.id, specie,currentLocation,currentImageUri);

                    console.log(`Species ${specie.id} added to user ${authStore.user.id}`);

                    set((state) => ({
                        ...state,
                        isLoading: false,
                    }));
                } catch (error) {
                    console.error('Error adding species to user:', error);
                    set((state) => ({
                        ...state,
                        isLoading: false,
                        error: error instanceof Error ? error : new Error('Erreur lors de l\'ajout de l\'espèce')
                    }));
                }
            },
            resetState: () => {
                set(initialState);
            }
        })
    )
);