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
            default: throw new Error(`Invalid SuccessType string: ${type}`);
        }
    }

    private toString(type: SuccessType): SuccessTypeNormal {
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
            0,  
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
            type: this.toString(domain.type),
            evenement: domain.event
        };
    }

    toUpdateDto(domain: Partial<Success>): Partial<SuccessNormalDto> {
        return {
            id: domain.id,
            nom: domain.nom,
            image: domain.image,
            description: domain.description,
            //actualVal: domain.actualVal,
            objectif: domain.objectif,
            type: domain.type !== undefined ? this.toString(domain.type) : undefined,
            evenement: domain.event
        };
    }
}