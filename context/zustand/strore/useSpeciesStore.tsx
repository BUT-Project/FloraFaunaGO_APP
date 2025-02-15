import Specie from "@/model/domain/Specie";
import {create} from 'zustand';
import { devtools } from 'zustand/middleware';
import {useAuthStore} from "@/context/zustand/strore/useAuthStore";
import StubData from "@/dal/StubLib/StubData";
import Location from "@/model/domain/Location";
import CaptureDetail from "@/model/domain/CaptureDetail";
import Capture from "@/model/domain/Capture";
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
                console.log('Setting current specie:', specie);

                if (!currentImageUri) {
                    console.log("Current image uri: " + currentImageUri);
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
            addSpecieToUser: async (specie: Specie, currentLocation : Location) => {
                console.log('Adding Specie to user:', specie);
                try {
                    const { currentImageUri } = get();
                    if (!currentImageUri) {
                        console.log("Current image uri: " + currentImageUri);
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
                    console.log("Get started")
                    const { captureRepository } = StubData.getInstance();
                    // [TODO] BOYYY
                    await captureRepository?.addSpecieToUser(authStore.user.id, specie,currentLocation,currentImageUri);

                    if (!authStore.user.captures) {
                        authStore.user.captures = [];
                    }

                    // Check if species is already added
                    const specieInUserCaptures = authStore.user.captures.find(s => s.id === specie.id);

                    const newCaptureDetail = new CaptureDetail(
                        Date.now(),
                        new Date(),
                        false, // Default shiny value [TODO]
                        currentLocation
                    );
                    if (specieInUserCaptures) {
                        useAuthStore.setState((state) => {
                            if (!state.user) return state;
                            return {
                                ...state,
                                user: {
                                    ...state.user,
                                    captures: state.user.captures.map(capture =>
                                        capture.id === specieInUserCaptures.id
                                            ? {
                                                ...capture,
                                                capturesDetails: [...capture.capturesDetails, newCaptureDetail]
                                            }
                                            : capture
                                    )
                                }
                            };
                        });
                    } else {
                        const newCapture = new Capture(
                            Date.now(),
                            currentImageUri,
                            specie,
                            [newCaptureDetail]
                        );
                        console.log("On ajoute une capture des captures", newCapture, authStore.user.captures);
                        useAuthStore.setState((state) => {
                            if (!state.user) return state;
                            return {
                                ...state,
                                user: {
                                    ...state.user,
                                    captures: [...(state.user.captures || []), newCapture]
                                }
                            };
                        });
                        authStore.user.captures.push(newCapture);
                    }
                    console.log(`Species ${specie.id} added to user ${authStore.user.id}`);
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