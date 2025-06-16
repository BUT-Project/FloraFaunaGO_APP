import {GenericRepository} from "@/dal/repository/IGenericRepository";
import Specie from "@/model/domain/Specie";
import {PagingResult} from "@/shared/PagingResult";
import {PagedRequest} from "@/shared/PagedRequest";

export interface ISpeciesRepository extends GenericRepository<Specie> {
    identifySpecies(imageBase64: string): Promise<Specie>;
    getRelatedSpeciesByFamily(specieId: string, request : PagedRequest): Promise<PagingResult<Specie>>;
}
