import {z} from "zod";
import {IUserRepository} from "@/dal/repository/IUserRepository";
import {ZodHttpClient} from "@/dal/network/ZodHttpClient";
import {HttpZodRepository, HttpZodRepositoryConfig} from "@/dal/network/NetworkGenericClient";
import {
    UpdateUtilisateur, UpdateUtilisateurSchema, UtilisateurApiResponseSchema, UtilisateurListApiResponseSchema,
    UtilisateurNormalDto,
    UtilisateurNormalDtoSchema
} from "@/shared/scheme/UtilisateurNormalDtoSchema";
import {IUserMapper, UserMapper} from "@/shared/mappers/UserMaper";
import User from "@/model/domain/User";
import {PagedRequest} from "@/shared/PagedRequest";
import {PagingResult} from "@/shared/PagingResult";

/**
 * Configuration for the User HTTP repository
 */
const createUserRepositoryConfig = (): HttpZodRepositoryConfig<UtilisateurNormalDto, UtilisateurNormalDto, UpdateUtilisateur> => ({
    responceSchema: UtilisateurNormalDtoSchema,
    createSchema: UtilisateurNormalDtoSchema,
    updateSchema: UpdateUtilisateurSchema,
    responseSchemas: {
        create: UtilisateurApiResponseSchema,
        update: UtilisateurApiResponseSchema,
        delete: z.object({ success: z.boolean() })
    }
});

/**
 * Network repository implementation for User entities
 *
 * Follows SOLID principles:
 * - Single Responsibility: Handles only network operations for Users
 * - Open/Closed: Extends HttpZodRepository, closed for modification
 * - Liskov Substitution: Can be substituted for IUserRepository
 * - Interface Segregation: Implements only relevant repository methods
 * - Dependency Inversion: Depends on abstractions (HttpZodRepository, IUserMapper)
 */
export class UserNetworkRepository extends HttpZodRepository<UtilisateurNormalDto, UtilisateurNormalDto, UpdateUtilisateur> implements IUserRepository {
    private readonly mapper: IUserMapper;

    constructor(
        httpClient: ZodHttpClient,
        baseUrl: string = '/utilisateur',
        mapper: IUserMapper = new UserMapper()
    ) {
        super(httpClient, baseUrl, createUserRepositoryConfig());
        this.mapper = mapper;
    }

    /**
     * Create a new user
     */
    async create(user: User): Promise<void> {
        const dto = this.mapper.toDto(user);
        await super.create(dto);

    }

    /**
     * Update an existing user
     */
    async update(id: number, user: User): Promise<void> {
        const updateDto = this.mapper.toUpdateDto(user);
        await super.update(id, updateDto);
    }

    /**
     * Delete a user by ID
     */
    async delete(id: number): Promise<void> {
        await super.delete(id);
    }

    /**
     * Get a user by ID
     */
    async getById(id: number): Promise<User> {
        const dto = await super.getById(id);
        return this.mapper.toDomain(dto);
    }

    /**
     * Get all users with pagination
     */
    async getAll(request: PagedRequest): Promise<PagingResult<User>> {
        const dtoResult = await super.getAll(request);

        return {
            count: dtoResult.count,
            index: dtoResult.index,
            total: dtoResult.total,
            items: dtoResult.items.map(dto => this.mapper.toDomain(dto))
        };
    }

    /**
     * Build query parameters specific to user API requirements
     */
    protected buildQueryParams(request: PagedRequest): any {
        const params = super.buildQueryParams(request);

        // Map generic ordering to user-specific criteria
        if (request.orderingPropertyName) {
            switch (request.orderingPropertyName.toLowerCase()) {
                case 'id':
                    params.criterium = 0;
                    break;
                case 'username':
                case 'pseudo':
                    params.criterium = 1;
                    break;
                case 'inscriptiondate':
                case 'dateinscription':
                    params.criterium = 2;
                    break;
                default:
                    params.criterium = 0; // Default to ID
            }
        }

        return params;
    }
}