import {GenericRepository} from "@/model/service/IGenericRepository";
import Specie from "@/model/domain/Specie";
import {Family} from "@/model/domain/Family";
import {PagingResult} from "@/shared/PagingResult";

export interface ISpeciesRepository extends GenericRepository<Specie> {
    identifySpecies(imageBase64: string): Promise<Specie>;
    getByFamily(family: Family, page: number, pageSize: number , selfId?: number): Promise<PagingResult<Specie>>;
}
