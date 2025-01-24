import {Sucess} from "@/model/Sucess";
import {GenericRepository} from "@/dal/StubLib/IGenericRepository";
import {FilterPredicate} from "@/dal/StubLib/FilterPredicate";
import {PagingResult} from "@/dal/StubLib/PagingResult";

export default class StubSucess  extends GenericRepository<Sucess> {
    constructor(public Sucesses: Sucess[]) {
        super()
    }
    count(filter: FilterPredicate<Sucess>): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                const filteredItems = this.Sucesses.filter(filter);
                resolve(filteredItems.length);
            } catch (error) {
                reject(new Error('An error occurred while counting items'));
            }
        });
    }

    create(newSuccess: Sucess) : Promise<void> {
         return new Promise((resolve) => {
             this.Sucesses.push(newSuccess);
             resolve();
         });
    }


     getById(nom?: string): Promise<Sucess> {
        return new Promise((resolve) => {
            const suc = this.Sucesses.find(suc => suc.nom == nom)
            if(suc !== undefined) {
                resolve(suc)
            }
        });

    }

    public async getAll(page: number = 1, pageSize: number = 9): Promise<PagingResult<Sucess>> {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const items = this.Sucesses.slice(startIndex, endIndex);
        const total = this.Sucesses.length;
        return new Promise((resolve) => {
            const pagingResult = new PagingResult<Sucess>(page, items.length, total, items);
            resolve(pagingResult);
        });
    }

    update(id:string,updatedSuccess: Sucess): Promise<void> {
        return new Promise((resolve, reject) => {
            const index = this.Sucesses.findIndex(sucess => sucess.nom === updatedSuccess.nom);

            if (index === -1) {
                reject(new Error('Success not found'));
                return;
            }

            // Mise à jour de l'élément à l'index trouvé
            this.Sucesses[index] = { ...this.Sucesses[index], ...updatedSuccess } as Sucess;

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
