import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import Specie from "@/model/domain/Specie";
import {ISpeciesRepository} from "@/model/service/ISpeciesRepository";
import {PagedRequest} from "@/shared/PagedRequest";
import Location from "@/model/domain/Location";
import Habitat from "@/model/domain/Habitat";
import {Climate} from "@/model/domain/Climate";
import {Diet} from "@/model/domain/Diet";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";
import Capture from "@/model/domain/Capture";

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
            // const response = await this.makeApiRequest(imageBase64);
            // return await this.processApiResponse(response);
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

        // Extract the genus and species from the scientific name
        const [genus, species] = bestMatch.name.split(' ');

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

    private mapKingdom(kingdom: string): Kingdom {
        const kingdomMap: { [key: string]: Kingdom } = {
            'Animalia': Kingdom.Animal,
            'Fungi': Kingdom.Fungi,
            'Plantae': Kingdom.Plant,
            'Protista': Kingdom.Protista
        };
        return kingdomMap[kingdom] || Kingdom.Animal;
    }

    private mapClass(className: string): Class {
        const classMap: { [key: string]: Class } = {
            'Mammalia': Class.Mammals,
            'Aves': Class.Birds,
            'Reptilia': Class.Reptiles,
            'Amphibia': Class.Amphibians,
            'Actinopterygii': Class.Fish,
            'Insecta': Class.Insects,
            'Magnoliopsida': Class.Angiosperms
        };
        return classMap[className] || Class.Insects;
    }

    private mapFamily(familyName: string): Family {
        const familyMap: { [key: string]: Family } = {
            'Canidae': Family.Canid,
            'Bovidae': Family.Bovids,
            'Leporidae': Family.Leporids,
            'Hominidae': Family.Hominids,
            'Coccinellidae': Family.Coccinellidae,
            'Sciuridae': Family.Sciuridae,
            // Add more family mappings as needed
        };
        return familyMap[familyName] || Family.Scarabaeidae;
    }
    // [TODO] Dave
/*    private inferDiet(classification: KindWiseResponse['result'][0]['classification']): Diet {
        // This is a simple inference based on order/family
        // You might want to enhance this with more detailed logic
        const orderDietMap: { [key: string]: Diet } = {
            'Carnivora': Diet.Carnivores,
            'Herbivora': Diet.Herbivores,
            'Lepidoptera': Diet.Nectarivores,
            'Hymenoptera': Diet.Omnivores
        };
        return orderDietMap[classification.order] || Diet.Omnivores;
    }*/
}