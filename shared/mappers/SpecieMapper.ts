import { Class, Climate, Diet, Family, Habitat, Kingdom, Specie} from "@/model/domain";
import {SpecieDto} from "../scheme/SpecieDtoSchema";
import {IMapper} from "@/shared/mappers/IMapper";
import {getImageUri} from "@/shared/utils";

export class SpecieMapper implements IMapper<SpecieDto, Specie> {

    toDomain(dto: SpecieDto): Specie {
        return new Specie(
            dto.id,
            dto.nom,
            dto.nom_scientifique,
            dto.description,
            new Habitat(dto.zone,dto.climat),
            dto.regime,
            dto.kingdom, 
            dto.class,
            dto.famille,
            [], // [YOAN] TODO: On ne gère pas les Locations pour pck ils y sont pas encore dans le DTO
            getImageUri(dto.image)!
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

    toUpdateDto(domain: Partial<Specie>): Partial<SpecieDto> {
        throw new Error("Method not implemented We should not update a specie in the database, only get it");
    }
}