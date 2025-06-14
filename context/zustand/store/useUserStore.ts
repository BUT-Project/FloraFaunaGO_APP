import { create } from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import User from "@/model/domain/User";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { FilterPredicate } from "@/shared/FilterPredicate";

interface UserStoreState {
    users: User[];
    total: number;
    loading: boolean;
    fetchUsers: (request: PagedRequest) => Promise<void>;
    getUserById: (id: string) => Promise<User | null>;
    updateUser: (id: string, updatedUser: User) => Promise<void>;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
    users: [],
    total: 0,
    loading: false,

    fetchUsers: async (request: PagedRequest) => {
        set({ loading: true });
        try {
            const { userRepository } = StubData.getInstance();
            if (!userRepository) throw new Error("UserRepository is not available");
            const result: PagingResult<User> = await userRepository.getAll(request);
            set({ users: result.items, total: result.total });
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs:", error);
        } finally {
            set({ loading: false });
        }
    },

    getUserById: async (id: string): Promise<User | null> => {
        try {
            const { userRepository } = StubData.getInstance();
            if (!userRepository) throw new Error("UserRepository is not available");
            return await userRepository.getById(id);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error);
            return null;
        }
    },

    updateUser: async (id: string, updatedUser: User): Promise<void> => {
        try {
            const { userRepository } = StubData.getInstance();
            if (!userRepository) throw new Error("UserRepository is not available");
            await userRepository.update(id, updatedUser);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        }
    }
}));
