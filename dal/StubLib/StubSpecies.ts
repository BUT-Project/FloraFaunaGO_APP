import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import Specie from "@/model/domain/Specie";
import {ISpeciesRepository} from "@/dal/repository/ISpeciesRepository";
import {PagedRequest} from "@/shared/PagedRequest";

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
            const specie = this.Species.find(specie => specie.id === id);
            if (!specie) {
                return;
            }
            resolve(specie);
        });
    }

    private applyFilters(species: Specie[], filters?: Record<string, any>): Specie[] {
        if (!filters) {
            return species;
        }

        return species.filter(specie => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    return true; // Skip empty filters
                }

                // Handle array values (multiple selections)
                if (Array.isArray(value)) {
                    if (value.length === 0) return true;
                    return value.some(v => this.matchesFilter(specie, key, v));
                }

                return this.matchesFilter(specie, key, value);
            });
        });
    }

    private matchesFilter(specie: Specie, key: string, value: any): boolean {
        const specieValue = (specie as any)[key];

        if (specieValue === null || specieValue === undefined) {
            return false;
        }

        // Handle string filters (partial match, case insensitive)
        if (typeof value === 'string' && typeof specieValue === 'string') {
            return specieValue.toLowerCase().includes(value.toLowerCase());
        }

        // Handle enum/object comparisons
        if (typeof specieValue === 'object' && typeof value === 'string') {
            // For enums like Kingdom, Class, Family, etc.
            return specieValue.toString() === value ||
                (specieValue.name && specieValue.name === value) ||
                (specieValue.value && specieValue.value === value);
        }

        // Handle direct equality
        return specieValue === value;
    }

    private applySorting(species: Specie[], orderingPropertyName?: string | null, descending?: boolean | null): Specie[] {
        if (!orderingPropertyName) {
            return species;
        }

        const sorted = [...species].sort((a, b) => {
            const aValue = (a as any)[orderingPropertyName];
            const bValue = (b as any)[orderingPropertyName];

            // Handle null/undefined values
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            // Handle string comparison
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.localeCompare(bValue);
            }

            // Handle numeric comparison
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return aValue - bValue;
            }

            // Handle object comparison (for enums)
            if (typeof aValue === 'object' && typeof bValue === 'object') {
                const aStr = aValue.toString() || aValue.name || aValue.value || '';
                const bStr = bValue.toString() || bValue.name || bValue.value || '';
                return aStr.localeCompare(bStr);
            }

            // Default comparison
            return String(aValue).localeCompare(String(bValue));
        });

        return descending ? sorted.reverse() : sorted;
    }

    getAll(request: PagedRequest): Promise<PagingResult<Specie>> {
        return new Promise((resolve) => {
            // Apply filters first
            let filteredSpecies = this.applyFilters(this.Species, request.filter);

            // Apply sorting
            filteredSpecies = this.applySorting(
                filteredSpecies,
                request.orderingPropertyName,
                request.descending
            );

            // Apply pagination
            const startIndex = (request.index - 1) * request.count;
            const endIndex = startIndex + request.count;
            const items = filteredSpecies.slice(startIndex, endIndex);
            const total = filteredSpecies.length;

            const pagingResult = new PagingResult<Specie>(request.index, items.length, total, items);
            resolve(pagingResult);
        });
    }

    update(id: string, updatedSpecie: Specie): Promise<void> {
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

    delete(id: string): Promise<void> {
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

    getRelatedSpeciesByFamily(specieId: string, request : PagedRequest): Promise<PagingResult<any>> {
        const { count : pageSize, index : page } = request;
        return new Promise((resolve) => {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const items = this.Species.filter((capture) =>
                capture.family === specieId &&
                (specieId === undefined || capture.id !== specieId)
            );
            const pageItems = items.slice(startIndex, endIndex);
            const total = items.length;
            const pagingResult = new PagingResult<Specie>(page, pageItems.length, total, pageItems);
            resolve(pagingResult);
        });
    }
    public async identifySpecies(imageBase64: string): Promise<Specie> {
        try {
            // ======= Stub sa retourne le lion =======
            return this.Species[0];
        } catch (error) {
            console.error('Error identifying species:', error);
            throw new Error('Failed to identify species');
        }
    }
}