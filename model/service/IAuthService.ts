import User from "@/model/domain/User";

export default interface IAuthService {
    login: (username: string, password: string) => Promise<User>;
    register(email: string, password: string, username?: string): Promise<User>;
    logout: () => Promise<void>;
    getUser: () => Promise<User | null>;
    isAuthenticated: () => Promise<boolean>;
    resetPassword(email:string,oldPassword:string,newPassword:string) : Promise<void>

}