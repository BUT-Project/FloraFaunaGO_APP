import { Success } from "@/model/domain/Success";
import {  SuccessNormalDto, SuccessTypeNormal } from "../scheme/SuccessNormalDtoSchema";
import { IMapper } from "./IMapper";
import { SuccessType } from "@/model/domain/SuccessType";

export class SuccessMapper implements IMapper<SuccessNormalDto,Success> {
    private toEnum(type: String): SuccessType {
        switch (type) {
            case "CAPTURE": return SuccessType.CAPTURE;
            case "DISTANCE": return SuccessType.DISTANCE;
            case "LIEUX": return SuccessType.LIEUX;
            case "PHOTO": return SuccessType.PHOTO;
            default: return SuccessType.PHOTO;
            // #TODO Since the api might return an invalid type, we default to PHOTO otherwise it will throw an error throw new Error(`Invalid SuccessType string: ${type}`)
        }
    }

    private typeToString(type: SuccessType): SuccessTypeNormal {
        return SuccessType[type] as SuccessTypeNormal;
    }
    
    toDomain(dto: SuccessNormalDto): Success {
        if (
            !dto.id ||
            !dto.nom ||
            !dto.image ||

            //dto.actualVal === undefined ||
            dto.objectif === undefined ||
            !dto.description ||
            dto.type === undefined ||
            !dto.evenement
        ) {
            throw new Error("Invalid DTO: missing required fields for Success domain model");
        }

        return new Success(
            dto.id,
            dto.nom,
            dto.image,
            dto.description,
            0,// actualVal par défaut #TODO : check if this is correct
            dto.objectif,          // objectif
            this.toEnum(dto.type), // type
            dto.evenement          // event
        );
    }

    toDto(domain: Success): SuccessNormalDto {
        return {
            id: domain.id,
            nom: domain.nom,
            image: domain.image,
            description: domain.description,
            //actualVal: domain.actualVal,
            objectif: domain.objectif,
            type: this.typeToString(domain.type),
            evenement: domain.event
        };
    }

    toUpdateDto(domain: Partial<Success>): Partial<SuccessNormalDto> {
        const result: Partial<SuccessNormalDto> = {};

        if (domain.nom !== undefined) result.nom = domain.nom;
        if (domain.image !== undefined) result.image = domain.image;
        if (domain.description !== undefined) result.description = domain.description;
        if (domain.objectif !== undefined) result.objectif = domain.objectif;
        if (domain.type !== undefined) result.type = this.typeToString(domain.type);
        if (domain.event !== undefined) result.evenement = domain.event;

        return result;
    }

    toDomains(dtos:SuccessNormalDto[]):Success[]{
        return dtos.map(dto=> this.toDomain(dto));

    }
}