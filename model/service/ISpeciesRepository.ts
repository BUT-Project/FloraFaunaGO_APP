import {GenericRepository} from "@/model/service/IGenericRepository";
import Specie from "@/model/domain/Specie";

export interface ISpeciesRepository extends GenericRepository<Specie> {
    identifySpecies(imageBase64: string): Promise<Specie>;
}
