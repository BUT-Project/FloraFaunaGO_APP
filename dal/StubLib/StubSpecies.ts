import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import Specie from "@/model/domain/Specie";
import {ISpeciesRepository} from "@/dal/repository/ISpeciesRepository";
import {PagedRequest} from "@/shared/PagedRequest";

import {Family} from "@/model/domain/Family";
export default class StubSpecies implements ISpeciesRepository {
    constructor(public Species: Specie[]) {
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

    getById(id: string): Promise<Specie> {
        return new Promise((resolve) => {
            // Convert string id to number for comparison
            const numericId = parseInt(id);

            // Handle invalid id
            if (isNaN(numericId)) {
                return;
            }

            const specie = this.Species.find(specie => specie.id === numericId);
            if (!specie) {
                return;
            }
            resolve(specie);
        });
    }

    getAll(request: PagedRequest): Promise<PagingResult<Specie>> {
        return new Promise((resolve) => {
            const startIndex = (request.index - 1) * request.count;
            const endIndex = startIndex + request.count;
            const items = this.Species.slice(startIndex, endIndex);
            const total = this.Species.length;
            const pagingResult = new PagingResult<Specie>(request.index, items.length, total, items);
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

    getByFamily(family: Family, page: number = 1, pageSize: number = 10, selfId?: number): Promise<PagingResult<Specie>> {
        return new Promise((resolve) => {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const items = this.Species.filter((capture) =>
                capture.family === family &&
                (selfId === undefined || capture.id !== selfId)
            );
            const pageItems = items.slice(startIndex, endIndex);
            const total = items.length;
            const pagingResult = new PagingResult<Specie>(page, pageItems.length, total, pageItems);
            resolve(pagingResult);
        });
    }
    public async identifySpecies(imageBase64: string): Promise<Specie> {
        try {
            //const response = await this.makeApiRequest(imageBase64);
            // ======= API =======
 /**
  const response = await this.makeApiRequest(imageBase64);

  const newSpecie = await this.processApiResponse(response);

            // Check if species already exists in the list by scientific name
            const existingSpecie = this.Species.find(
                specie => specie.scientificName.toLowerCase() === newSpecie.scientificName.toLowerCase()
            );

            if (!existingSpecie) {
                // Generate a new ID (use the maximum existing ID + 1)
                const maxId = Math.max(...this.Species.map(s => s.id), 0);
                newSpecie.id = maxId + 1;

                // Add the new species to the list
                await this.create(newSpecie);
                return newSpecie;
            }

            return existingSpecie;
     **/
            // ======= Stub sa retourne le lion =======

            return this.Species[0];
        } catch (error) {
            console.error('Error identifying species:', error);
            throw new Error('Failed to identify species');
        }
    }
}