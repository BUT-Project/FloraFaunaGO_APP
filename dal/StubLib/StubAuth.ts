import User from "@/model/domain/User";
import IAuthService from "@/model/service/IAuthService";


export default class StubAuth implements IAuthService{

    private currentUser: User | null = null;

    constructor(public Users: User[]) {
    }
    login(email: string, password: string): Promise<User> {
        const user = this.Users.find(u => u.email.toLocaleLowerCase() == email);
        return new Promise((resolve, reject) => {
            if (user !== undefined) {
                this.currentUser = user;
                    resolve(user);
                }
            else {
                    reject(new Error("Incorrect password"));
                }
        });
    }
    register(email: string, password: string): Promise<User> {
        console.log(email)
        return new Promise((resolve, reject) => {
            const existingUser = this.Users.find(user => user.email === email);

            if (existingUser) {
                reject(new Error("User already exists"));
                return;
            }
            const newUser: User = {
                id: this.Users.length + 1,
                username: email.split('@')[0],
                email :email,
                passwordHash: password,
                inscriptionDate: new Date(),
                _success:[],
                captures:[]
            };

            this.Users.push(newUser);
            this.currentUser = newUser;
            resolve(newUser);
        });
    }
    logout(): Promise<void> {
        this.currentUser = null;
        return Promise.resolve();
    }

    getUser(): Promise<User | null> {
        return Promise.resolve(this.currentUser);
    }

    isAuthenticated(): Promise<boolean> {
        return Promise.resolve(this.currentUser !== null);
    }

}