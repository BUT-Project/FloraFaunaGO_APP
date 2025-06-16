import {
    UtilisateurCompleteResponse
} from "@/shared/scheme/UtilisateurNormalDtoSchema";
import User from "@/model/domain/User";
import {IMapper} from "./IMapper";
import {Capture} from "@/model/domain";
import { ISpeciesRepository } from "@/dal/repository/ISpeciesRepository";

/**
 * User mapper implementation
 * Follows the Mapper pattern to separate domain model from network DTOs
 */
export class UserMapper implements IMapper<UtilisateurCompleteResponse, User> {
    constructor(private speciesRepository?: ISpeciesRepository) {}
    
    toDomain(dto: UtilisateurCompleteResponse): User {
        const dtoData = dto.utilisateur;
        if (!dtoData.id || !dtoData.pseudo || !dtoData.mail || !dtoData.dateInscription) {
            throw new Error("Invalid DTO: missing required fields for User domain model");
        }

        const inscriptionDate = typeof dtoData.dateInscription === 'string'
            ? new Date(dtoData.dateInscription)
            : dtoData.dateInscription;

        return new User(
            dtoData.id,
            dtoData.pseudo,
            dtoData.mail,
            //dtoData.hash_mdp,
            "fakePasswordHash",// should be remove [DAVE] [TODO] password not included in domain model for security
            inscriptionDate,
            // Skip captures for now - they will be fetched separately to avoid incomplete data
            [], // #TODO: [Dave] ask cheval how to handle this shitttt. capture is not in the dto but the domain model need it
            [], // [DAVE] #TODO successState is includ in the domain but there no mapper for it yet look with [Patrick] [TODO] check if this is correct
            dtoData.image || undefined // Optional field, can be undefined
        );
    }

    toDto(domain: User): UtilisateurCompleteResponse {
        return {
            utilisateur: {
                id: domain.id,
                pseudo: domain.username,
                mail: domain.email,
                dateInscription: domain.inscriptionDate.toISOString(),
                image: domain.image || null, // Optional field,
                hash_mdp: domain.passwordHash
            }
        };
    }

    toUpdateDto(domain: Partial<User>): Partial<UtilisateurCompleteResponse> {
        if (!domain.id || !domain.username || !domain.email) {
            throw new Error("Invalid domain: missing required fields for User update DTO");
        }
        return {
            utilisateur: {
                id: domain.id,
                pseudo: domain.username,
                mail: domain.email,
                dateInscription: null, // Date is not updated, handled separately
                image: domain.image || null,
                hash_mdp: domain.passwordHash ||null // Password updates handled separately [DAVE] [TODO] comment on modifier le password je pence que ya une requete dans le auth entity
            }
        }
    }

    toDomains(dtos: UtilisateurCompleteResponse[]): User[] {
        return dtos.map(dto => this.toDomain(dto));
    }

    /**
     * Populate captures with full specie data by fetching from species repository
     * #TODO: [Dave] ask cheval how to handle this shitttt. capture is not in the dto but the domain model need it
     */
    async populateUserCaptures(user: User, captureData: any[]): Promise<User> {
        if (!this.speciesRepository || !captureData || captureData.length === 0) {
            return user;
        }
        // #TODO: [Dave] ask cheval how to handle this shitttt. capture is not in the dto but the domain model need it

        try {
            const capturesWithSpecies = await Promise.all(
                captureData.map(async (captureDto) => {
                    try {
                        // Fetch the full specie data
                        const specie = await this.speciesRepository!.getById(captureDto.idEspece);
                        
                        // Create capture with real specie data
                        return new Capture(captureDto.id, captureDto.photo, specie, []);
                    } catch (error) {
                        console.warn(`Failed to fetch specie ${captureDto.idEspece}:`, error);
                        // Return null for failed fetches - will be filtered out
                        return null;
                    }
                })
            );

            // Filter out null values (failed fetches)
            const validCaptures = capturesWithSpecies.filter(capture => capture !== null) as Capture[];
            
            // Update user with populated captures
            user.captures = validCaptures;
            
            return user;
        } catch (error) {
            console.error('Failed to populate user captures:', error);
            return user;
        }
    }
}