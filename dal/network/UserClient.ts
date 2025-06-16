import {IUserRepository} from "@/dal/repository/IUserRepository";
import {ZodHttpClient} from "@/dal/network/ZodHttpClient";
import {HttpZodResourceClient} from "@/dal/network/HttpZodResourceClient";
import {
    UtilisateurCompleteResponseSchema,
    UtilisateurCompleteResponse
} from "@/shared/scheme/UtilisateurNormalDtoSchema";
import {UserMapper} from "@/shared/mappers/UserMaper";
import User from "@/model/domain/User";
import {PagedRequest} from "@/shared/PagedRequest";
import {PagingResult} from "@/shared/PagingResult";
import { FilterPredicate } from "@/shared/FilterPredicate";
import {IMapper} from "@/shared/mappers/IMapper";
import { ISpeciesRepository } from "@/dal/repository/ISpeciesRepository";

/**
 * Handles only network operations for Users
 */
export class UserClient implements IUserRepository {
    private readonly mapper: IMapper<UtilisateurCompleteResponse, User>;

    constructor(
        private httpClient: ZodHttpClient,
        baseUrl: string = '/FloraFaunaGo_API/utilisateur',
        mapper: IMapper<UtilisateurCompleteResponse, User> = new UserMapper(),
        private userRepository : HttpZodResourceClient<UtilisateurCompleteResponse> = HttpZodResourceClient.create<UtilisateurCompleteResponse>(httpClient, baseUrl,UtilisateurCompleteResponseSchema),
        private speciesRepository?: ISpeciesRepository
    ) {
        this.mapper = mapper;
    }

    /**
     * Create a new user
     */
    async create(user: User): Promise<void> {
        throw new Error("Method not implemented. In UserClient create");
    }

    /**
     * Update an existing user
     */
    async update(id: string, user: User): Promise<void> {
        const endpoint = `/api/Auth/edit-user`;

        const body = {
            pseudo: user.username,
            mail: user.email,
            image: user.image,
        };

        const dto = await this.httpClient.post(endpoint, body);
        console.log("User updated successfully", dto);
    }

    /**
     * Delete a user by ID
     */
    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented. In UserClient delete");
    }

    /**
     * Get a user by ID
     */
    async getById(id: string): Promise<User> {
        const dto = await this.userRepository.getById(id);
        const user = this.mapper.toDomain(dto);
        
        // If we have a species repository and there are captures, populate them
        if (this.speciesRepository && dto.capture && dto.capture.length > 0 && this.mapper instanceof UserMapper) {
            // #TODO: [Dave] ask cheval how to handle this shitttt. capture is not in the dto but the domain model need it
            return await this.mapper.populateUserCaptures(user, dto.capture);
        }
        
        return user;
    }

    /**
     * Get all users with pagination
     */
    async getAll(request: PagedRequest): Promise<PagingResult<User>> {
        const dtoResult = await this.userRepository.getAll(request);

        return {
            count: dtoResult.count,
            index: dtoResult.index,
            total: dtoResult.total,
            items: dtoResult.items.map(dto => this.mapper.toDomain(dto))
        };
    }


    async count(filter: FilterPredicate<User>): Promise<number> {
        throw new Error("Method not implemented.");
    }

}