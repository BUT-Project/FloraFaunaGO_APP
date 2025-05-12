import User from "@/model/domain/User";

export default interface IAuthService {
    login: (username: string, password: string) => Promise<User>;
    register(email: string, username: string, password: string): Promise<User>;
    logout: () => Promise<void>;
    getUser: () => Promise<User | null>;
    isAuthenticated: () => Promise<boolean>;
}