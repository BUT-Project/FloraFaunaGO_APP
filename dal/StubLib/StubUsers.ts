import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import {IUserRepository} from "@/model/service/IUserRepository";
import User from "@/model/domain/User";
import {PagedRequest} from "@/shared/PagedRequest";
import {filter} from "domutils";
import id from "ajv/lib/vocabularies/core/id";
import items from "ajv/lib/vocabularies/applicator/items";
import {index} from "@zxing/text-encoding/es2015/encoding/indexes";
import Specie from "@/model/domain/Specie";
import {undefined} from "zod";
import CaptureDetail from "@/model/domain/CaptureDetail";
import Capture from "@/model/domain/Capture";


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

    getById(id: number): Promise<User> {
        return new Promise((resolve) => {
            const user = this.Users.find(u => u.id === id) || null; // Recherche de l'utilisateur par nom
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