import {GenericRepository} from "@/model/service/IGenericRepository";
import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import {ISuccessRepository} from "@/model/service/ISuccessRepository";
import {Success} from "@/model/domain/Success";
import {PagedRequest} from "@/shared/PagedRequest";

export default class StubSucess  implements ISuccessRepository {
    constructor(public Sucesses: Success[]) {
    }
    count(filter: FilterPredicate<Success>): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                const filteredItems = this.Sucesses.filter(filter);
                resolve(filteredItems.length);
            } catch (error) {
                reject(new Error('An error occurred while counting items'));
            }
        });
    }

    create(newSuccess: Success) : Promise<void> {
         return new Promise((resolve) => {
             this.Sucesses.push(newSuccess);
             resolve();
         });
    }


    getById(nom?: string): Promise<Success> {
        return new Promise((resolve) => {
            const suc = this.Sucesses.find(suc => suc.nom == nom)
            if(suc !== undefined) {
                resolve(suc)
            }
        });

    }
    public async getAll(request: PagedRequest): Promise<PagingResult<Success>> {
        const startIndex = (request.index - 1) * request.count;
        const endIndex = startIndex + request.count;

        const items = this.Sucesses.slice(startIndex, endIndex);
        const total = this.Sucesses.length;
        return new Promise((resolve) => {
            const pagingResult = new PagingResult<Success>(request.index, items.length, total, items);
            resolve(pagingResult);
        });
    }

    update(id:string,updatedSuccess: Success): Promise<void> {
        return new Promise((resolve, reject) => {
            const index = this.Sucesses.findIndex(sucess => sucess.nom === updatedSuccess.nom);

            if (index === -1) {
                reject(new Error('Success not found'));
                return;
            }

            // Mise à jour de l'élément à l'index trouvé
            this.Sucesses[index] = { ...this.Sucesses[index], ...updatedSuccess } as Success;

            resolve();
        });
    }

    delete(nom: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const initialLength = this.Sucesses.length;
            this.Sucesses = this.Sucesses.filter(sucess => sucess.nom !== nom);

            if (this.Sucesses.length === initialLength) {
                reject(new Error('Success not found'));
                return;
            }

            resolve();
        });
    }
}
