import {create} from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import User from "@/model/domain/User";
import {setStorageItemAsync, useStorageState} from "@/libs/secureStore";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    rememberMe: boolean;
    login: (username: string, password: string, remember?: boolean) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setRememberMe: (value: boolean) => void;
}

const AUTH_TOKEN_KEY = 'auth_token';
const REMEMBER_ME_KEY = 'remember_me';

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    rememberMe: false,


    login: async (username: string, password: string, remember: boolean = false) => {
        console.log(`Trying to conect with params username=${username}&password=${password}&remember=${remember}`);
        const {authService} = StubData.getInstance();
        const user = await authService?.login(username, password);
        if (remember) {
            console.log('In remember');
            await setStorageItemAsync(AUTH_TOKEN_KEY, JSON.stringify({
                user,
                timestamp: new Date().getTime()
            }));
            await setStorageItemAsync(REMEMBER_ME_KEY, 'true');
        }

        set({user, isAuthenticated: true, rememberMe: remember});
    },

    register: async (email: string, password: string) => {
        const {authService} = StubData.getInstance();
        const user = await authService?.register(email, password);
        set({user, isAuthenticated: true});
    },

    logout: async () => {
        const {authService} = StubData.getInstance();
        await authService?.logout();
        // Clear stored authentication state
        await setStorageItemAsync(AUTH_TOKEN_KEY, null);
        await setStorageItemAsync(REMEMBER_ME_KEY, null);

        set({user: null, isAuthenticated: false, rememberMe: false});
    },
    checkAuth: async () => {
        console.log(`Trying to check auth`);
        const {authService} = StubData.getInstance();
        const isAuthenticated = await authService?.isAuthenticated();
        if (isAuthenticated) {
            const user = await authService?.getUser();
            set({user, isAuthenticated});
        } else {
            console.log('Incorrect authentication');
            const [[isStoredAuthLoading, storedAuth],se] = useStorageState(REMEMBER_ME_KEY);

            const [[isRememberedLoginLoading, rememberedLogin],se2] = useStorageState(REMEMBER_ME_KEY);
            console.log("Checking session", storedAuth, rememberedLogin);
            if (rememberedLogin === 'true' && storedAuth) {
                try {
                    const parsedAuth = JSON.parse(storedAuth);
                    const timestamp = parsedAuth.timestamp;

                    // Check if stored auth is not expired (e.g., 30 days)
                    const isValid = (new Date().getTime() - timestamp) < (30 * 24 * 60 * 60 * 1000);

                    if (isValid) {
                        set({
                            user: parsedAuth.user,
                            isAuthenticated: true,
                            rememberMe: true
                        });
                        return;
                    }
                } catch (e) {
                    console.error('Error parsing stored auth:', e);
                }
            }
            set({user: null, isAuthenticated: false});
        }
    },
    setRememberMe: async (value: boolean) => {
        set({rememberMe: value});
    },
}));

