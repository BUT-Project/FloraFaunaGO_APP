import User from "@/model/User";

export default interface IAuthService {
    login(email: string, password: string): Promise<User>;

    register(email: string, password: string): Promise<User>;

    logout(): Promise<void>;

    resetPassword(email: string): Promise<boolean>;

    changePassword(oldPassword: string, newPassword: string): Promise<boolean>;

    getUserInfo(): Promise<User>;

    isUserAuthenticated(): Promise<boolean>;
}