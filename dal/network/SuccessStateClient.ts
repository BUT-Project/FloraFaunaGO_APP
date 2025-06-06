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
import { SuccessMapper } from "@/shared/mappers/SuccessMaper";
import {Success} from "@/model/domain/Success";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { FilterPredicate } from "@/shared/FilterPredicate";
import { IMapper } from "@/shared/mappers/IMapper";
import { UtilisateurApiResponseSchema, UtilisateurNormalDto, UtilisateurNormalDtoSchema } from "@/shared/scheme/UtilisateurNormalDtoSchema";
import { UserMapper } from "@/shared/mappers/UserMaper";
import User from "@/model/domain/User";

const createUserRepositoryConfig = (): HttpZodRepositoryConfig<UtilisateurNormalDto> => ({
    responceSchema: UtilisateurNormalDtoSchema,
    createSchema: UtilisateurNormalDtoSchema,
    responseSchemas: {
        create: UtilisateurApiResponseSchema,
        update: UtilisateurApiResponseSchema,
        delete: z.object({success: z.boolean()})
    }
});

const createSuccessRepositoryConfig = (): HttpZodRepositoryConfig<SuccessNormalDto> => ({
  responceSchema: SuccessNormalDtoSchema,
  createSchema: SuccessNormalDtoSchema,
  responseSchemas: {
    create: SuccessApiResponseSchema,
    update: SuccessApiResponseSchema,
    delete: z.object({ success: z.boolean() })
  }
});

export class SuccessClient implements ISuccessRepository {
  private readonly mapper: IMapper<SuccessNormalDto, Success>;

  constructor( 
    httpClient: ZodHttpClient,
    baseUrl: string = "/successState",
    mapper: IMapper<SuccessNormalDto, Success> = new SuccessMapper(),
        private userRepository = new HttpZodRepository<UtilisateurNormalDto>(
      httpClient,
      baseUrl,
      createUserRepositoryConfig()
    ),
    private successRepository = new HttpZodRepository<SuccessNormalDto>(
      httpClient,
      baseUrl,
      createSuccessRepositoryConfig()
    )
  ) {
    this.mapper = mapper;
  }
    isCompleted(suc: Success): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }

  async create(success: Success): Promise<void> {
        throw new Error("Method not implemented.");
  }

  async update(id: number, success: Success): Promise<void> {
    const dto = this.mapper.toUpdateDto(success);
    await this.successRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
  }

  async getById(id: number): Promise<Success> {
    const dto = await this.successRepository.getById(id);
    return this.mapper.toDomain(dto);
  }

  async getAll(request: PagedRequest): Promise<PagingResult<Success>> {
    const dtoResult = await this.successRepository.getAll(request);
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
