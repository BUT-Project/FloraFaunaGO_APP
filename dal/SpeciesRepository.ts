import {GenericRepository} from "@/dal/IGenericRepository";
import Specie from "@/model/Specie";
import {FilterPredicate} from "@/dal/FilterPredicate";

export abstract class SpeciesRepository extends GenericRepository<Specie> {
    abstract create(item: Specie): Promise<void>;
    abstract getById(id: string): Promise<Specie>;
    abstract update(id: string, item: Specie): Promise<void>;
    abstract delete(id: string): Promise<void>;

    abstract getAll(request: PagedRequest, filter: FilterPredicate<Specie>): Promise<PagingResult<Specie>>;
    abstract count(filter: FilterPredicate<Specie>): Promise<number>;

}