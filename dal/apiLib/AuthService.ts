import IAuthService from "@/dal/IAuthService";
import User from "@/model/User";

class AuthService implements IAuthService{
    changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    getUserInfo(): Promise<User> {
        return Promise.resolve(undefined);
    }

    isUserAuthenticated(): Promise<boolean> {
        return Promise.resolve(false);
    }

    login(email: string, password: string): Promise<User> {
        return Promise.resolve(undefined);
    }

    logout(): Promise<void> {
        return Promise.resolve(undefined);
    }

    register(email: string, password: string): Promise<User> {
        return Promise.resolve(undefined);
    }

    resetPassword(email: string): Promise<boolean> {
        return Promise.resolve(false);
    }

}