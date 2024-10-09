import User from "@/model/User";
import Specie from "@/model/Specie";

export default class StubUsers {
    constructor(public Users: User[]) {
    }
     createUser(newUser: User) {
        this.Users.push(newUser);
    }

     readUser(id?: number): User | null {
        return this.Users.find(user => user.id === id) || null;
    }

     readAllUsers(page: number = 1, pageSize: number = 10): User[] {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return this.Users.slice(startIndex, endIndex);
    }

    // UPDATE: Mettre à jour un utilisateur par ID
     updateUser(updatedUser: User) {
        const index = this.Users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
            this.Users[index] = { ...this.Users[index], ...updatedUser };
        }
    }


     deleteUser(id: number) {
        return this.Users.filter(user => user.id !== id);
    }

}