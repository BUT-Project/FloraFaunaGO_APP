import { Specie} from "@/model/domain";
import {SpecieDto, SpecieListDto} from "../scheme/SpecieDtoSchema";
import {IMapper} from "@/shared/mappers/IMapper";
import {getImageUri} from "@/shared/utils";

export class SpecieListMapper implements IMapper<SpecieListDto, Partial<Specie>> {

    toDomain(dto: SpecieListDto): Partial<Specie> {
        return {
            id: dto.id,
            name: dto.nom,
            image: getImageUri(dto.image)
        };
    }

    toDto(domain: Specie): SpecieListDto {
          throw new Error("Method not implemented We should not update a specie in the database, only get it");
    }

    toUpdateDto(domain: Partial<Specie>): Partial<SpecieDto> {
        throw new Error("Method not implemented We should not update a specie in the database, only get it");
    }

    toDomains(dtos: SpecieListDto[]): Partial<Specie>[] {
        return dtos.map(dto => this.toDomain(dto));
    }
}