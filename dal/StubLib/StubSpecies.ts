import Specie from "@/model/Specie";
import {GenericRepository} from "@/dal/StubLib/IGenericRepository";
import {FilterPredicate} from "@/dal/StubLib/FilterPredicate";
import {PagingResult} from "@/dal/StubLib/PagingResult";

export default class StubSpecies extends GenericRepository<Specie> {
    constructor(public Species: Specie[]) {
        super();
    }

    count(filter: FilterPredicate<Specie>): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                const filteredItems = this.Species.filter(filter);
                resolve(filteredItems.length);
            } catch (error) {
                reject(new Error('An error occurred while counting items'));
            }
        });
    }

    create(newSpecie: Specie): Promise<void> {
        return new Promise((resolve) => {
            this.Species.push(newSpecie);
            resolve();
        });
    }

    getById(id: number): Promise<Specie> {
        return new Promise((resolve) => {
            const specie = this.Species.find(specie => specie.id === id) || null;
        });
    }

    getAll(page: number = 1, pageSize: number = 10): Promise<PagingResult<Specie>> {
        return new Promise((resolve) => {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const items = this.Species.slice(startIndex, endIndex);
            const total = this.Species.length;
            const pagingResult = new PagingResult<Specie>(page, items.length, total, items);
            resolve(pagingResult);
        });
    }

    update(id: number, updatedSpecie: Specie): Promise<void> {
        return new Promise((resolve, reject) => {
            const index = this.Species.findIndex(specie => specie.id === id);
            if (index === -1) {
                reject(new Error('Specie not found'));
                return;
            }
            this.Species[index] = { ...this.Species[index], ...updatedSpecie };
            resolve();
        });
    }

    delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const initialLength = this.Species.length;
            this.Species = this.Species.filter(specie => specie.id !== id);

            if (this.Species.length === initialLength) {
                reject(new Error('Specie not found'));
                return;
            }

            resolve();
        });
    }
}