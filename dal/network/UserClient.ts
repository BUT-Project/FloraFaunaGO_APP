import {z} from "zod";
import {IUserRepository} from "@/dal/repository/IUserRepository";
import {ZodHttpClient} from "@/dal/network/ZodHttpClient";
import {HttpZodResourceClient} from "@/dal/network/HttpZodResourceClient";
import {
    UtilisateurNormalDto,
    UtilisateurNormalDtoSchema
} from "@/shared/scheme/UtilisateurNormalDtoSchema";
import {UserMapper} from "@/shared/mappers/UserMaper";
import User from "@/model/domain/User";
import {PagedRequest} from "@/shared/PagedRequest";
import {PagingResult} from "@/shared/PagingResult";
import { FilterPredicate } from "@/shared/FilterPredicate";
import {IMapper} from "@/shared/mappers/IMapper";

/**
 * Handles only network operations for Users
 */
export class UserClient implements IUserRepository {
    private readonly mapper: IMapper<UtilisateurNormalDto, User>;

    constructor(
        httpClient: ZodHttpClient,
        baseUrl: string = '/utilisateur',
        mapper: IMapper<UtilisateurNormalDto, User> = new UserMapper(),
        private userRepository : HttpZodResourceClient<UtilisateurNormalDto> = HttpZodResourceClient.create<UtilisateurNormalDto>(httpClient, baseUrl,UtilisateurNormalDtoSchema)
    ) {
        this.mapper = mapper;
    }

    /**
     * Create a new user
     */
    async create(user: User): Promise<void> {
        const dto = this.mapper.toDto(user);
        await this.userRepository.create(dto);
    }

    /**
     * Update an existing user
     */
    async update(id: string, user: User): Promise<void> {
        const updateDto = this.mapper.toUpdateDto(user);
        await this.userRepository.update(id, updateDto);
    }

    /**
     * Delete a user by ID
     */
    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    /**
     * Get a user by ID
     */
    async getById(id: string): Promise<User> {
        const dto = await this.userRepository.getById(id);
        return this.mapper.toDomain(dto);
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