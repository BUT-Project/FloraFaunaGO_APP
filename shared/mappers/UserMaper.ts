import { UtilisateurNormalDto} from "@/shared/scheme/UtilisateurNormalDtoSchema";
import User from "@/model/domain/User";

/**
 * Mapper interface for converting between domain models and DTOs
 */
export interface IUserMapper {
    toDomain(dto: UtilisateurNormalDto): User;
    toDto(domain: User): UtilisateurNormalDto;
    toUpdateDto(domain: Partial<User>): Partial<UtilisateurNormalDto>;
}

/**
 * User mapper implementation
 * Follows the Mapper pattern to separate domain model from network DTOs
 */
export class UserMapper implements IUserMapper {
    toDomain(dto: UtilisateurNormalDto): User {
        if (!dto.id || !dto.pseudo || !dto.mail || !dto.dateInscription) {
            throw new Error("Invalid DTO: missing required fields for User domain model");
        }

        const inscriptionDate = typeof dto.dateInscription === 'string'
            ? new Date(dto.dateInscription)
            : dto.dateInscription;

        return new User(
            parseInt(dto.id), // Convert UUID string to number if needed, or keep as string
            dto.pseudo,
            "fakePasswordHash",// should be remove [DAVE] [TODO] password not included in domain model for security
            dto.mail,
            inscriptionDate,
            [], // [DAVE] [TODO]
            [] // [DAVE] [TODO]
        );
    }

    toDto(domain: User): UtilisateurNormalDto {
        return {
            id: domain.id.toString(),
            pseudo: domain.username,
            mail: domain.email,
            dateInscription: domain.inscriptionDate.toISOString(),
            hash_mdp: undefined // Password not included in domain model for security [DAVE] [TODO]
        };
    }

    toUpdateDto(domain: Partial<User>): Partial<UtilisateurNormalDto> {
        return {
            pseudo: domain.username,
            mail: domain.email,
            dateInscription: domain.inscriptionDate?.toISOString(),
            hash_mdp: undefined // Password updates handled separately [DAVE] [TODO] comment on modifier le password je pence que ya une requete dans le auth entity
        };
    }
}