import {create} from 'zustand';
import User from "@/model/domain/User";
import {getStorageItemAsync, setStorageItemAsync} from "@/libs/secureStore";
import { AppFacadeService } from "@/services/AppFacadeService";

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
    resetPassword(email:string,oldPassword:string,newPassword:string) : Promise<void>;
    syncCurrentUser: () => Promise<void>; // Synchronize the current user data with the server that ugly but works #TODO [Dave] : refactor this
}

const AUTH_TOKEN_KEY = 'auth_token';
const REMEMBER_ME_KEY = 'remember_me';

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    rememberMe: false,
    isAuthCheckCompleted:false,

    login: async (email: string, password: string, remember: boolean = false) => {
        try {
            console.log(`🔐 Attempting login for email: ${email}`);
            const appFacade = AppFacadeService.getInstance();
            console.log('📞 Calling appFacade.login...');
            const user = await appFacade.login(email, password);
            console.log('✅ Login successful, user:', { id: user.id, username: user.username, email: user.email });
            
            if (remember) {
                console.log('💾 Saving remember me preference');
                await setStorageItemAsync(REMEMBER_ME_KEY, 'true');
            }
            
            set({user, isAuthenticated: true, rememberMe: remember});
            console.log('🎉 Auth state updated successfully');
        } catch (error) {
            console.error('❌ Login failed:', error);
            console.error('❌ Error type:', typeof error);
            console.error('❌ Error constructor:', error?.constructor?.name);
            console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
            console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            
            if (error instanceof Error && error.message.includes('404')) {
                console.error('🚫 HTTP 404 - Login endpoint not found or user not found');
            } else if (error instanceof Error && error.message.includes('401')) {
                console.error('🔒 HTTP 401 - Invalid credentials');
            } else if (error instanceof Error && error.message.includes('500')) {
                console.error('💥 HTTP 500 - Server error during login');
            }
            
            throw error;
        }
    },

    resetPassword: async (email: string, oldPassword: string, newPassword: string) => {
        try {
            const appFacade = AppFacadeService.getInstance();
            await appFacade.resetPassword(email, oldPassword, newPassword);
            console.log('✅ Password reset successful');
        } catch (error) {
            console.error('❌ Password reset failed:', error);
            throw error;
        }
    },

    register: async (email: string, password: string,username?: string) => {
        try {
            const appFacade = AppFacadeService.getInstance();
            const user = await appFacade.register(email, password, username);
            set({user, isAuthenticated: true});
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const appFacade = AppFacadeService.getInstance();
            await appFacade.logout();
            
            // Clear stored authentication state
            await setStorageItemAsync(AUTH_TOKEN_KEY, null);
            await setStorageItemAsync(REMEMBER_ME_KEY, null);
            
            set({user: null, isAuthenticated: false, rememberMe: false});
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    },
    checkAuth: async () => {
        try {
            const appFacade = AppFacadeService.getInstance();
            
            const isAuthenticated = await appFacade.isAuthenticated();
            if (isAuthenticated) {
                const user = await appFacade.getCurrentUser();
                set({user, isAuthenticated, isAuthCheckCompleted:true});
            } else {
                const storedAuth = await getStorageItemAsync(AUTH_TOKEN_KEY);
                const rememberedLogin = await getStorageItemAsync(REMEMBER_ME_KEY);

                if (rememberedLogin === 'true' && storedAuth !== null) {
                    try {
                        const parsedAuth = JSON.parse(storedAuth);
                        const timestamp = parsedAuth.timestamp;
                        const isValid = (new Date().getTime() - timestamp) < (30 * 24 * 60 * 60 * 1000);

                        if (isValid) {
                            const storedUser = await appFacade.getUserById(parsedAuth.user);
                            if (storedUser) {
                                set({
                                    user: storedUser,
                                    isAuthenticated: true,
                                    rememberMe: true,
                                    isAuthCheckCompleted:true,
                                });
                                return;
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing stored auth :', e);
                        // If user not found (404), clear stored auth
                        if (e instanceof Error && e.message.includes('404')) {
                            console.warn('User not found, clearing stored auth');
                            await setStorageItemAsync(AUTH_TOKEN_KEY, null);
                            await setStorageItemAsync(REMEMBER_ME_KEY, null);
                        }
                    }
                }
                set({user: null, isAuthenticated: false, isAuthCheckCompleted:true});
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            set({user: null, isAuthenticated: false, isAuthCheckCompleted:true});
        }
    },
    setRememberMe: async (value: boolean) => {
        set({rememberMe: value});
    },
    syncCurrentUser: async () => {
        const currentUser = get().user;
        if (currentUser) {
            try {
                const appFacade = AppFacadeService.getInstance();
                const refreshedUser = await appFacade.getUserById(currentUser.id);
                if (refreshedUser) {
                    set({ user: refreshedUser });
                }
            } catch (error : unknown) {
                console.error('Failed to sync user data:', error);
                // Si erreur 401, déconnecter
                if (typeof error === "object" && error !== null && "status" in error && (error as any).status === 401) {
                    set({ user: null, isAuthenticated: false });
                }
            }
        }
    },
}));
