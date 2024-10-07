// import create from 'zustand';
// import { AuthInterface, User, createAuthService } from '../services/auth/AuthInterface';
//
// interface AuthState {
//     user: User | null;
//     isAuthenticated: boolean;
//     authService: AuthInterface;
//     login: (username: string, password: string) => Promise<void>;
//     logout: () => Promise<void>;
//     checkAuth: () => Promise<void>;
//     resetPassword: (email: string) => Promise<void>;
// }
//
// export const useAuthStore = create<AuthState>((set, get) => ({
//     user: null,
//     isAuthenticated: false,
//     authService: createAuthService('local'), // ou 'remote' avec l'URL de l'API
//
//     login: async (username: string, password: string) => {
//         const { authService } = get();
//         const user = await authService.login(username, password);
//         set({ user, isAuthenticated: true });
//     },
//
//     logout: async () => {
//         const { authService } = get();
//         await authService.logout();
//         set({ user: null, isAuthenticated: false });
//     },
//
// resetPassword: async (email) => {
//         const { authService } = get();
//     await authService.resetPassword(email);
// },
//     checkAuth: async () => {
//         const { authService } = get();
//         const isAuthenticated = await authService.isAuthenticated();
//         if (isAuthenticated) {
//             const user = await authService.getUser();
//             set({ user, isAuthenticated });
//         } else {
//             set({ user: null, isAuthenticated: false });
//         }
//     },
// }));