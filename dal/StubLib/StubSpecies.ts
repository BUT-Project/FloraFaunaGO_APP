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

    getById(id: number): Promise<Specie> {
        return new Promise((resolve) => {
            const specie = this.Species.find(specie => specie.id === id) || null;
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

    async identifySpecies(imageBase64: string): Promise<Specie> {
        console.log('Identifying species...',imageBase64);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const location1: Location = new Location(13.33,19.09,3, 5, 1); // Desert Tchad
        const specie1 = new Specie(1, 'Lion', 'Panthera leo', "Le Lion (Panthera leo) est une espèce de mammifères carnivores de la famille des Félidés. La femelle du lion est la lionne, son petit est le lionceau. Le mâle adulte, aisément reconnaissable à son importante crinière, accuse une masse moyenne qui peut être variable selon les zones géographiques où il se trouve, allant de 145 à 180 kg pour les lions d'Asie à plus de 225 kg pour les lions d'Afrique.", new Habitat('jungle', Climate.Tropical), Diet.Carnivores, Kingdom.Animal, Class.Mammals, Family.Felidae, [location1, location1], 'https://upload.wikimedia.org/wikipedia/commons/6/6f/011_The_lion_king_Tryggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg');
        return specie1;
    }
}