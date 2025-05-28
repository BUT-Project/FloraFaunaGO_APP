import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import {ISuccessRepository, TestSuccessParams} from "@/dal/repository/ISuccessRepository";
import {Success} from "@/model/domain/Success";
import {PagedRequest} from "@/shared/PagedRequest";
import { SuccessType } from "@/model/domain/SuccessType";
import { SuccessStore } from "@/context/zustand/store/useSuccessStore";
import { Kingdom } from "@/model/domain/Kingdom";
import { Class } from "@/model/domain/Class";
import { Diet } from "@/model/domain/Diet";
import { Family } from "@/model/domain/Family";


export default class StubSucess  implements ISuccessRepository {

    constructor(public Sucesses: Success[]) {
    }

    async executeSuccessQueue (queue: TestSuccessParams[]) : Promise<void> {
        queue.forEach((params, index) => {
            setTimeout(() => {
                this.TestSuccess(params);
            }, index * 5000);
    
            
        });
    }
    async processSuccessByType(successType: SuccessType, spec: any) : Promise<any> {

        const allSuccess = await this.getAll({ index: 1, count: 100 });
    
        // Filtrer les succès par type (ex: CAPTURE, PHOTO...)
        const filteredSuccesses = allSuccess?.items.filter(success => success.type === successType);
    
        const successQueue: TestSuccessParams[] = [];
        const seen = new Set<string>();
    
        for (const success of filteredSuccesses ?? []) {
    
            const key = `${success.event}-${spec.id}`;
            if (seen.has(key)) continue; // ← déjà traité
            seen.add(key);
            const params: TestSuccessParams = { name: success.event, spec };
    
            const kingdoms = Object.values(Kingdom);
            const classes = Object.values(Class);
            const diets = Object.values(Diet);
            const families = Object.values(Family);
    
            for (const kingdom of kingdoms) {
                if (success.event.includes(kingdom)) {
                    params.kg = kingdom;
                    break;
                }
            }
    
            for (const cl of classes) {
                if (success.event.includes(cl)) {
                    params.cl = cl;
                    break;
                }
            }
    
            for (const diet of diets) {
                if (success.event.includes(diet)) {
                    params.dt = diet;
                    break;
                }
            }
    
            for (const family of families) {
                if (success.event.includes(family)) {
                    params.fm = family;
                    break;
                }
            }
    
            successQueue.push(params);
        }
    
        this.executeSuccessQueue(successQueue);
    
        return spec;

    }

    async TestSuccess({ name, spec, cl, kg, dt, fm }: TestSuccessParams): Promise<void> {
        if ( !spec) return;


        const success = await this.getById(name);
        if (!success) return;
    
        if (
            (cl && cl !== spec.class) ||
            (kg && kg !== spec.kingdom) ||
            (dt && dt !== spec.diet) ||
            (fm && fm !== spec.family)
        ) {
            return;
        }
    
        if (success.objectif !== success.actualVal) {
            await SuccessStore.getState().updateSuccess(name);
        }
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



    getById(event?: string): Promise<Success> {
        return new Promise((resolve, reject) => {
            const suc = this.Sucesses.find(suc => suc.event == event)
            if(suc !== undefined) {
                resolve(suc)
            } else {
                reject(new Error(`Success with event '${event}' not found`));
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
            const index = this.Sucesses.findIndex(sucess => sucess.event === id);

            if (index === -1) {
                reject(new Error(`Success with event '${id}' not found for update`));
                return;
            }

            // Mise à jour de l'élément à l'index trouvé
            this.Sucesses[index] = { ...this.Sucesses[index], ...updatedSuccess, event: id } as Success;

            resolve();
        });
    }

    delete(nom: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const initialLength = this.Sucesses.length;
            this.Sucesses = this.Sucesses.filter(sucess => sucess.nom !== nom);

            if (this.Sucesses.length === initialLength) {
                reject(new Error(`Success with nom '${nom}' not found for delete`));
                return;
            }

            resolve();
        });
    }
}
