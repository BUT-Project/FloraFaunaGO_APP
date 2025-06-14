import { ISuccessRepository } from "@/dal/repository/ISuccessRepository";
import { ZodHttpClient } from "@/dal/network/ZodHttpClient";
import {
  HttpZodRepository,
  HttpZodRepositoryConfig
} from "@/dal/network/NetworkGenericClient";
import {
  SuccessNormalDto,
  SuccessNormalDtoSchema,
  SuccessApiResponseSchema
} from "@/shared/scheme/SuccessNormalDtoSchema";
import { z } from "zod";
import { SuccessMapper } from "@/shared/mappers/SuccessMapper";
import { Success } from "@/model/domain/Success";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { FilterPredicate } from "@/shared/FilterPredicate";
import { IMapper } from "@/shared/mappers/IMapper";
import IAuthService from "@/model/service/IAuthService";

/**
 * Configuration du repository réseau pour les succès
 */
const createSuccessRepositoryConfig = (): HttpZodRepositoryConfig<SuccessNormalDto> => ({
  responceSchema: SuccessNormalDtoSchema,
  createSchema: SuccessNormalDtoSchema,
  responseSchemas: {
    create: SuccessApiResponseSchema,
    update: SuccessApiResponseSchema,
    delete: z.object({ success: z.boolean() })

  }
});


/**
 * Client réseau pour la ressource "Succès"
 */
export class SuccessClient implements ISuccessRepository {

  constructor(
    private readonly httpClient: ZodHttpClient,
    private authService: IAuthService,
    baseUrl: string = "/success",
    private mapper: IMapper<SuccessNormalDto, Success> = new SuccessMapper(),
    private successRepository = new HttpZodRepository<SuccessNormalDto>(
      httpClient,
      baseUrl,
      createSuccessRepositoryConfig()
    ),
  ) {
  }
  isCompleted(suc: Success): Promise<Boolean> {
    throw new Error("Method not implemented.");
  }

  async create(success: Success): Promise<void> {
    const dto = this.mapper.toDto(success);
    await this.successRepository.create(dto);
  }

  async update(id: number, success: Success): Promise<void> {
    const dto = this.mapper.toUpdateDto(success);
    await this.successRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.successRepository.delete(id);
  }

  async getById(id: number): Promise<Success> {
    const dto = await this.successRepository.getById(id);
    return this.mapper.toDomain(dto);
  }

  async getAll(request: PagedRequest): Promise<PagingResult<Success>> {
    const user = this.authService.getUser();
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }
    const dtoResult = await this.successRepository.getAll(request)
    user
    return {
      count: dtoResult.count,
      index: dtoResult.index,
      total: dtoResult.total,
      items: dtoResult.items.map(dto => this.mapper.toDomain(dto))
    };
  }

  async count(filter: FilterPredicate<Success>): Promise<number> {
    throw new Error("Méthode non implémentée.");
  }
}
