import {create} from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import User from "@/model/domain/User";
import {getStorageItemAsync, setStorageItemAsync} from "@/libs/secureStore";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    rememberMe: boolean;
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
    register: (email: string, password: string,username?: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setRememberMe: (value: boolean) => void;
    isAuthCheckCompleted: boolean;
}

const AUTH_TOKEN_KEY = 'auth_token';
const REMEMBER_ME_KEY = 'remember_me';

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    rememberMe: false,
    isAuthCheckCompleted:false,

    login: async (email: string, password: string, remember: boolean = false) => {
        const {authService} = StubData.getInstance();
        const user = await authService?.login(email, password);
        if (remember && user) {
            console.log(user);
            await setStorageItemAsync(AUTH_TOKEN_KEY, JSON.stringify({
                user: user?.id,
                timestamp: new Date().getTime()
            }));
            await setStorageItemAsync(REMEMBER_ME_KEY, 'true');
        }
        // [TODO] [Dave] add error handling since it can failed (like return true or use throw error from inner)
        set({user, isAuthenticated: true, rememberMe: remember});
    },

    register: async (email: string, password: string,username?: string) => {
        const {authService} = StubData.getInstance();
        
        // [TODO] [Dave] add error handling since it can failed (like return true)
        const user = await authService?.register(email, password,username ?? email);
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
        const {authService, userRepository} = StubData.getInstance();
        const isAuthenticated = await authService?.isAuthenticated();
        if (isAuthenticated) {
            const user = await authService?.getUser();
            set({user, isAuthenticated,isAuthCheckCompleted:true});
        } else {

            const storedAuth = await getStorageItemAsync(AUTH_TOKEN_KEY);
            const rememberedLogin = await getStorageItemAsync(REMEMBER_ME_KEY);

            if (rememberedLogin === 'true' && storedAuth !== null) {
                try {
                    const parsedAuth = JSON.parse(storedAuth);
                    const timestamp = parsedAuth.timestamp;

                    // Check if stored auth is not expired (e.g., 30 days)
                    const isValid = (new Date().getTime() - timestamp) < (30 * 24 * 60 * 60 * 1000);
                    const user = await userRepository?.getById(parsedAuth.user);
                    if (isValid && user) {
                        set({
                            user: user,
                            isAuthenticated: true,
                            rememberMe: true,
                            isAuthCheckCompleted:true,
                        });
                        return;
                    }
                } catch (e) {
                    console.error('Error parsing stored auth:', e);
                }
            }
            // If not authenticated or no valid stored auth, set user to null
            set({user: null, isAuthenticated: false,isAuthCheckCompleted:true});
        }
    },
    setRememberMe: async (value: boolean) => {
        set({rememberMe: value});
    },
}));
