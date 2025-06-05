import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import {IUserRepository} from "@/dal/repository/IUserRepository";
import User from "@/model/domain/User";
import {PagedRequest} from "@/shared/PagedRequest";


export default class StubUsers implements IUserRepository{
    constructor(public Users: User[]) {
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

    getById(id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            const user = this.Users.find(u => u.id == id);
            if (user == null) {
                reject(new Error('User not found'));
                return;
            }
            resolve(user);
        });
    }

    getAll(request: PagedRequest): Promise<PagingResult<User>> {
        return new Promise((resolve) => {
            const startIndex = (request.index - 1) * request.count;
            const endIndex = startIndex + request.count;
            const items = this.Users.slice(startIndex, endIndex);
            const total = this.Users.length;
            const pagingResult = new PagingResult<User>(request.index, items.length, total, items);
            resolve(pagingResult);
        });
    }

    update(id: string, updatedUser: User): Promise<void> {
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

    delete(id: string): Promise<void> {
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