import {SpeciesRepository} from "@/dal/SpeciesRepository";
import {FilterPredicate} from "@/dal/FilterPredicate";
import Specie from "@/model/Specie";
import {ApiClient} from "@/dal/apiLib/ApiClient";

export class SpeciesClient extends SpeciesRepository extends GenericClient {

    constructor(dataMgr: ApiClient) {
        super();
    }

    count(filter: FilterPredicate<Specie>): Promise<number> {
        return Promise.resolve(0);
    }

    create(item: Specie): Promise<void> {
        return Promise.resolve(undefined);
    }

    delete(id: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    getAll(request: PagedRequest, filter: FilterPredicate<Specie>): Promise<PagingResult<Specie>> {
        return Promise.resolve(undefined);
    }

    getById(id: string): Promise<Specie> {
        return Promise.resolve(undefined);
    }

    update(id: string, item: Specie): Promise<void> {
        return Promise.resolve(undefined);
    }
}