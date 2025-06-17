import { Class, Habitat, Specie, Diet, Kingdom, Family, Climate} from "@/model/domain";
import { SpecieDto, SpecieListDto } from "../scheme/SpecieDtoSchema";
import { IMapper } from "@/shared/mappers/IMapper";
import { getImageUri } from "@/shared/utils";
import { LocationMapper } from "./LocationMapper";

export class SpecieMapper implements IMapper<SpecieDto, Specie, SpecieListDto> {

    private locationsMapper:  LocationMapper = new LocationMapper();

    toDomain(dto: SpecieDto): Specie {
        return new Specie(
            dto.id,
            dto.nom,
            getImageUri(dto.image)!,
            dto.nom_Scientifique,
            dto.description,
            new Habitat(dto.zone,Climate[dto.climat as keyof typeof Climate]),
            Diet[dto.regime as keyof typeof Diet],
            Kingdom[dto.kingdom as keyof typeof Kingdom], 
            Class[dto.class as keyof typeof Class],
            Family[dto.famille as keyof typeof Family],
            this.locationsMapper.toDomains(dto.localisations ?? []), 
        );
    }

    toDto(domain: Specie): SpecieDto {
        // return {
        //     id:domain.id.toString(),
        //     nom:domain.name,
        //     nom_scientifique:domain.scientificName,
        //     description:domain.description,
        //     zone:domain.habitat.zone,
        //     climat:domain.habitat.climate,
        //     class:domain.class,
        //     kingdom:domain.kingdom,
        //     regime:domain.diet,
        //     famille:domain.family,
        //     image:domain.image,
        //     localisations:this.locationsMapper.toDtos(domain.locations),
        //     image3D:""
        // }
        throw new Error("Method not implemented We should not update a specie in the database, only get it");
    }

    toUpdateDto(domain: Partial<Specie>): Partial<SpecieDto> {
        throw new Error("Method not implemented We should not update a specie in the database, only get it");
    }

    private toDomainFromList(dto: SpecieListDto): Specie {
        return new Specie(
            dto.id,
            dto.nom,
            getImageUri(dto.image)!
        );
    }   

    toDomains(dtos: SpecieListDto[]): Specie[] {
        return dtos.map(dto => this.toDomainFromList(dto));
    }
    
}