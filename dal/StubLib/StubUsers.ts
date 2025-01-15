import User from "@/model/User";
import Specie from "@/model/Specie";
import {FilterPredicate} from "@/dal/StubLib/FilterPredicate";
import {PagingResult} from "@/dal/StubLib/PagingResult";
import {GenericRepository} from "@/dal/StubLib/IGenericRepository";

export default class StubUsers extends GenericRepository<User> {
    constructor(public Users: User[]) {
        super();
    }

    count(filter: FilterPredicate<User>): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                const filteredItems = this.Users.filter(filter);
                resolve(filteredItems.length);
            } catch (error) {
                reject(new Error('An error occurred while counting items'));
            }
        });
    }
    create(newUser: User): Promise<void> {
        return new Promise((resolve) => {
            this.Users.push(newUser);
            resolve();
        });
    }

    getById(id: number): Promise<User> {
        return new Promise((resolve) => {
            const user = this.Users.find(u => u.id === id) || null; // Recherche de l'utilisateur par nom
        });
    }

    getAll(page: number = 1, pageSize: number = 10): Promise<PagingResult<User>> {
        return new Promise((resolve) => {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const items = this.Users.slice(startIndex, endIndex);
            const total = this.Users.length;
            const pagingResult = new PagingResult<User>(page, items.length, total, items);
            resolve(pagingResult);
        });
    }

    update(id: number, updatedUser: User): Promise<void> {
        return new Promise((resolve, reject) => {
            const index = this.Users.findIndex(user => user.id === id);
            if (index === -1) {
                reject(new Error('User not found')); // Si l'utilisateur n'est pas trouvé, rejeter la promesse
                return;
            }
            this.Users[index] = { ...this.Users[index], ...updatedUser }; // Mettre à jour l'utilisateur
            resolve();
        });
    }

    delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const initialLength = this.Users.length;
            this.Users = this.Users.filter(user => user.id !== id);

            if (this.Users.length === initialLength) {
                reject(new Error('User not found'));
                return;
            }

            resolve();
        });
    }
}