import { Class, Climate, Diet, Family, Habitat, Kingdom, Specie} from "@/model/domain";
import {SpecieDto} from "../scheme/SpecieDtoSchema";
import {IMapper} from "@/shared/mappers/IMapper";

export class SpecieMapper implements IMapper<SpecieDto, Specie> {

    toDomain(dto: SpecieDto): Specie {
        return new Specie(
            parseInt(dto.id),
            dto.nom,
            dto.nom_scientifique,
            dto.description,
            new Habitat(dto.zone,dto.climat),
            dto.regime,
            dto.kingdom, 
            dto.class,
            dto.famille,
            [],
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
            class:domain.class,
            kingdom:domain.kingdom,
            regime:domain.diet,
            famille:domain.family,
            image:domain.image,
            image3D:""
        }
    }

    toUpdateDto(domain: Partial<Specie>): Partial<{ id: string; nom: string; nom_scientifique: string; description: string; image: string; image3D: string; class: Class; kingdom: Kingdom; famille: Family; zone: string; climat: Climate; regime: Diet; locationNormalDtos: { id: string; latitude: number; longitude: number; altitude: number; rayon: number; }[]; }> {
        throw new Error("Method not implemented We should not update a specie in the database, only get it");
    }
}