import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import Specie from "@/model/domain/Specie";
import {ISpeciesRepository} from "@/dal/repository/ISpeciesRepository";
import {PagedRequest} from "@/shared/PagedRequest";
import Location from "@/model/domain/Location";
import Habitat from "@/model/domain/Habitat";
import {Climate} from "@/model/domain/Climate";
import {Diet} from "@/model/domain/Diet";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";

interface KindWiseResponse {
    result: {
        classification: {
            suggestions: Array<{
                id: string;
                name: string;
                probability: number;
                details: {
                    common_names: string[] | null;
                    url: string;
                    description: {
                        value: string;
                        citation: string;
                        license_name: string;
                        license_url: string;
                    } | null;
                    image: {
                        value: string;
                        citation: string;
                        license_name: string;
                        license_url: string;
                    } | null;
                    language: string;
                    entity_id: string;
                }
            }>;
        };
        is_insect: {
            probability: number;
            threshold: number;
            binary: boolean;
        };
    };
    status: string;
    sla_compliant_client: boolean;
    sla_compliant_system: boolean;
    created: number;
    completed: number;
}


export default class StubSpecies implements ISpeciesRepository {
    private readonly apiUrl: string = "https://insect.kindwise.com/api/v1/identification";
    private readonly apiKey = 'RYhPBNogMQ3V3v89QnnV4Qmyxh7KN5dKS3we9ljdtvPYdrY17u';

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

    private async makeApiRequest(imageBase64: string): Promise<KindWiseResponse> {
        const url = new URL(this.apiUrl);
        url.searchParams.append('details', 'common_names,url,description,image');
        url.searchParams.append('language', 'fr');

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': this.apiKey,
            },
            body: JSON.stringify({ images: [imageBase64] })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    private async processApiResponse(response: KindWiseResponse): Promise<Specie> {
        if (!response.result?.classification?.suggestions?.length) {
            throw new Error('No species identified');
        }

        // Take the highest probability suggestion
        const bestMatch = response.result.classification.suggestions[0];
        const details = bestMatch.details;

        // Create a default habitat
        const habitat = new Habitat(
            "Unknown",
            Climate.Temperate
        );

        // Create a default location
        const defaultLocation = new Location(0, 0, 0, 0, 0);

        // Determine if it's an insect based on the API response
        const isInsect = response.result.is_insect.binary;
        const classType = isInsect ? Class.Insects : Class.Mammals; // Cause we use insect api it should always be insect

        return new Specie(
            3,
            details.common_names?.[0] || bestMatch.name,
            bestMatch.name,
            details.description?.value || '',
            habitat,
            Diet.Omnivores, // Default diet since API doesn't provide this information
            Kingdom.Animal, // Default kingdom since API doesn't provide this information
            classType,
            Family.Scarabaeidae, // Default family since API doesn't provide detailed taxonomy
            [defaultLocation],
            details.image?.value || ''
        );
    }
}