import User from "@/model/User";


export default class StubAuth {

    constructor(public Users: User[]) {
    }
    login(username: string, password: string): Promise<User> {
        const user = this.Users.find(u => u.username === username);

        return new Promise((resolve, reject) => {
            if (user !== undefined) {
                    resolve(user);
                }
            else {
                    reject(new Error("Incorrect password"));
                }
        });
    }
    register(email: string, password: string): Promise<User> {
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
            resolve(newUser);
        });
    }
    logout()  {


    }




}