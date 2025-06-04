import User from "@/model/domain/User";
import IAuthService from "@/model/service/IAuthService";

// should need private val userRepository: IUserService,private val keyManager: AbstractKeyManager.
// le stubData doit pas avoir le auth service  :: https://codefirst.iut.uca.fr/git/HeartDev/Android_APP/src/branch/main/HeartTrack/app/src/main/java/com/hearttrack/application/network/service/AuthService.kt
export default class StubAuth implements IAuthService{

    private currentUser: User | null = null;

    constructor(public Users: User[]) {
    }
    resetPassword(email: string,oldPassword:string, newPassword: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = this.Users.find(u => u.email === email);
            if (!user) {
                return reject(new Error("Utilisateur not found"));
            }

            resolve();
    })}
    login(email: string, password: string): Promise<User> {
        const user = this.Users.find(u => u.email.toLocaleLowerCase() == email && u.passwordHash == password);
        return new Promise((resolve, reject) => {
            // keyManager.putToken(response.accessToken)
            // currentUser = userRepository.getById(response.accessToken, response.accessToken.decodeJwt().second.nameid)
            if (user !== undefined) {
                this.currentUser = user;
                    resolve(user);
                }
            else {
                    reject(new Error("Mot de passe ou email incorrect"));
                }
        });
    }

    register(email: string, password: string, username: string): Promise<User> {
        return new Promise((resolve, reject) => {
            const existingUser = this.Users.find(user => user.email === email);

            if (existingUser) {
                reject(new Error("Cet email est déjà utilisé"));
                return;
            }
            const newUser: User = {
                id: this.Users.length + 1,
                username: username,
                email :email,
                passwordHash: password,
                inscriptionDate: new Date(),
                _success:[],
                captures:[]
            };
// same should be userRepo.add(newUser)
            this.Users.push(newUser);
            //  this.currentUser = userRepo.getById(response.accessToken.decodeJwt().second.id)
            this.currentUser = newUser;
            resolve(newUser);
        });
    }
    logout(): Promise<void> {
        this.currentUser = null;
        return Promise.resolve();
    }

    getUser(): Promise<User | null> {
        // api.getUserById(keyManager.getToken()!!, keyManager.getToken()!!.decodeJwt().second.nameid).toModel()
        return Promise.resolve(this.currentUser);
    }

    isAuthenticated(): Promise<boolean> {
        return Promise.resolve(this.currentUser !== null);
    }

}