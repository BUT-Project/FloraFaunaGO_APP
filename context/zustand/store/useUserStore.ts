import { create } from 'zustand';
import User from "@/model/domain/User";
import { AppFacadeService } from "@/services/AppFacadeService";
import { useAuthStore } from "@/context/zustand/store/useAuthStore";

interface UserStoreState {
    loading: boolean;
    updateUser: (id: string, updatedUser: User) => Promise<void>;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
    loading: false,
    updateUser: async (id: string, updatedUser: User): Promise<void> => {
        try {
            set({ loading: true });
            const appFacade = AppFacadeService.getInstance();
            await appFacade.updateUser(id, updatedUser);

            const authState = useAuthStore.getState();
            if (authState.user?.id === id) {
                await authState.syncCurrentUser();
            }
            set({ loading: false });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        }
    }
}));
