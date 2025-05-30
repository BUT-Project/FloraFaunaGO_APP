import { Class, Habitat, Kingdom, Specie } from "@/model/domain";
import { SpecieDto } from "../scheme/SpecieDtoSchema";
import { LocationMapper } from "./LocationMapper";

export interface ISpecieMapper {
    toDomain(dto: SpecieDto): Specie;
    toDto(domain: Specie): SpecieDto;

};

export class SpecieMapper implements ISpecieMapper {
    locationMapper: LocationMapper = new LocationMapper;
    
    toDomain(dto: SpecieDto): Specie {
    
        return new Specie(
            parseInt(dto.id),
            dto.nom,
            dto.nom_scientifique,
            dto.description,
            new Habitat(dto.zone,dto.climat),
            dto.regime,
            Kingdom.Animal, // TODO  ajouter à la DTO
            Class.Mammals, //TODO ajouter à la DTO
            dto.famille,
            this.locationMapper.toDomains(dto.locationNormalDtos),
            dto.image
        );
    }

    toDto(domain: Specie): SpecieDto {
        return {
            id:domain.id.toString(),
            nom:domain.name,
            nom_scientifique:domain.scientificName,
            description:domain.description,
            zone:domain.habitat.zone,
            climat:domain.habitat.climate,
            regime:domain.diet,
            famille:domain.family,
            locationNormalDtos:this.locationMapper.toDtos(domain.locations),
            image:domain.image,
            image3D:""
        }
    }
}