import { create } from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import User from "@/model/domain/User";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,

    login: async (username: string, password: string) => {
        const { authService } = StubData.getInstance();
        const user = await authService?.login(username, password);
        set({ user, isAuthenticated: true });
    },

    register: async (email: string, password: string) => {
        const { authService } = StubData.getInstance();
        const user = await authService?.register(email, password);
        set({ user, isAuthenticated: true });
    },

    logout: async () => {
        const { authService } = StubData.getInstance();
        await authService?.logout();
        set({ user: null, isAuthenticated: false });
    },
    checkAuth: async () => {
        const { authService } = StubData.getInstance();
        const isAuthenticated = await authService?.isAuthenticated();
        if (isAuthenticated) {
            const user = await authService?.getUser();
            set({ user, isAuthenticated });
        } else {
            set({ user: null, isAuthenticated: false });
        }
    },
}));
