import {GenericRepository} from "@/dal/repository/IGenericRepository";
import Specie from "@/model/domain/Specie";
import {PagingResult} from "@/shared/PagingResult";
import {PagedRequest} from "@/shared/PagedRequest";
import { Family } from "@/model/domain";

export interface ISpeciesRepository extends GenericRepository<Specie> {
    identifySpecies(imageBase64: string): Promise<Specie>;
    getRelatedSpeciesByFamily(specieId: string, family:Family, request : PagedRequest): Promise<PagingResult<Specie>>;
}
