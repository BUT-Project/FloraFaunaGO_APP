import { SuccessNormalDto } from "../scheme/SuccessNormalDtoSchema";
import { SuccessStateCompleteItem } from "../scheme/SuccessStateNormalDtoSchema";
import { Success } from "@/model/domain/Success";
import { SuccessType } from "@/model/domain/SuccessType";
import { IMapper } from "./IMapper";

/**
 * Mapper pour les données complètes de SuccessState (avec state, success, user)
 */
export class SuccessCompletMapper implements IMapper<SuccessStateCompleteItem, Success> {
    toDomains(dtos: SuccessStateCompleteItem[]): Success[] {
        if (!Array.isArray(dtos)) {
            throw new Error("Invalid input: expected an array of SuccessStateCompleteItem");
        }
        return dtos.map(dto => this.toDomain(dto));
    }
    
    /**
     * Convertit un objet SuccessStateCompleteItem (de l'API) vers le domaine Success
     */
    toDomain(dto: SuccessStateCompleteItem): Success {
        if (!dto.success || !dto.state) {
            throw new Error("Invalid DTO: missing success or state data");
        }

        return new Success(
            dto.success.id,
            dto.success.nom,
            dto.success.image,
            dto.success.description,
            dto.state.percentSucces,
            dto.success.objectif,
            this.toEnum(dto.success.type),
            dto.success.evenement
        );
    }

    /**
     * Convertit un objet Success du domaine vers le format DTO
     * Note: Retourne seulement les données essentielles pour l'état
     */
    toDto(domain: Success): SuccessStateCompleteItem {
        return {
            state: {
                id: domain.id, // ou un vrai ID si disponible
                percentSucces: domain.actualVal,
                isSucces: domain.actualVal >= domain.objectif // Détermine si le succès est atteint
            },
            success: {
                id: domain.id,
                nom: domain.nom,
                image: domain.image,
                description: domain.description,
                objectif: domain.objectif,
                type: this.toString(domain.type),
                evenement: domain.event
            },
            user: null // Placeholder pour l'utilisateur, à remplir si nécessaire
        };

    }

    /**
     * Pour les mises à jour partielles
     */
    toUpdateDto(domain: Partial<Success>): Partial<SuccessStateCompleteItem> {
        throw new Error("toUpdateDto not implemented for SuccessCompletMapper");
    }

    /**
     * Convertit un type string vers SuccessType enum
     */
    private toEnum(type: string): SuccessType {
        switch (type) {
            case "CAPTURE": return SuccessType.CAPTURE;
            case "DISTANCE": return SuccessType.DISTANCE;
            case "LIEUX": return SuccessType.LIEUX;
            case "PHOTO": return SuccessType.PHOTO;
            default: return SuccessType.PHOTO;
            // #TODO Since the api might return an invalid type, we default to PHOTO otherwise it will throw an error throw new Error(`Invalid SuccessType string: ${type}`)
        }
    }

    /**
     * Convertit SuccessType enum vers string
     */
    private toString(type: SuccessType): string {
        return SuccessType[type] as string;
    }

    /**
     * Méthode utilitaire pour créer un Success à partir de données séparées
     * (si vous avez besoin de combiner des données de différentes sources)
     */
    fromSeparateDtos(successDto: SuccessNormalDto, percentSucces: number = 0): Success {
        console.log("dave",successDto)
        return new Success(
            successDto.id,
            successDto.nom,
            successDto.image,
            successDto.description,
            percentSucces, // actualVal
            this.toEnum(successDto.type),
            successDto.objectif,
            successDto.evenement
        );
    }

    /**
     * Méthode pour extraire seulement les données d'état d'un Success
     */
    toStateData(domain: Success): { id: string; percentSucces: number } {
        return {
            id: domain.nom, // ou un vrai ID si disponible
            percentSucces: domain.actualVal
        };
    }

    /**
     * Méthode pour extraire seulement les données de succès d'un Success
     */
    toSuccessData(domain: Success): SuccessNormalDto {
        return {
            id: domain.id,
            nom: domain.nom,
            image: domain.image,
            description: domain.description,
            objectif: domain.objectif,
            type: this.toString(domain.type),
            evenement: domain.event
        };
    }
}