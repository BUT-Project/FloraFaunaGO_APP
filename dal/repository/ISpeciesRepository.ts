import {GenericRepository} from "@/dal/repository/IGenericRepository";
import Specie from "@/model/domain/Specie";
import {Family} from "@/model/domain/Family";
import {PagingResult} from "@/shared/PagingResult";

export interface ISpeciesRepository extends GenericRepository<Specie> {
    identifySpecies(imageBase64: string): Promise<Specie>;
    getRelatedSpeciesByFamily(specieId: string, page: number, pageSize: number): Promise<PagingResult<any>>;
}
