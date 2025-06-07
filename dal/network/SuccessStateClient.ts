import { ISuccessRepository } from "@/dal/repository/ISuccessRepository";
import { ZodHttpClient } from "@/dal/network/ZodHttpClient";
import {
  HttpZodRepository,
  HttpZodRepositoryConfig
} from "@/dal/network/NetworkGenericClient";

import {
  SuccessNormalDto,
  SuccessStateCompleteItem,
  SuccessListApiResponseSchema,
  SuccessStateListApiResponse,
  SuccessStateListApiResponseSchema,
  SuccessStateCompleteItemSchema
} from "@/shared/scheme/SuccessStateNormalDtoSchema";

import { z } from "zod";
import { SuccessCompletMapper } from "@/shared/mappers/SuccessCompletMapper";
import { Success } from "@/model/domain/Success";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { FilterPredicate } from "@/shared/FilterPredicate";
import { IMapper } from "@/shared/mappers/IMapper";
import { ISuccessStateRepository } from "../repository/ISuccessStateRepository";


const SuccessStateCreateDtoSchema = z.object({
  state: z.object({
    id: z.string().uuid(),
    percentSucces: z.number().int().nonnegative(),
    isSucces: z.boolean()
  }),
  success: z.object({
    id: z.string().uuid(),
    nom: z.string(),
    type: z.string(),
    image: z.string(),
    description: z.string(),
    objectif: z.number().int().nonnegative(),
    evenement: z.string()
  })
});

const SuccessStateApiResponseSchema = z.object({
  success: z.boolean(),
  item: SuccessStateCompleteItemSchema.optional()
});

const createSuccessRepositoryConfig = (): HttpZodRepositoryConfig<SuccessStateCompleteItem> => ({
  responceSchema: SuccessStateCompleteItemSchema,
  createSchema: SuccessStateCreateDtoSchema,
  responseSchemas: {
    create: SuccessStateApiResponseSchema,
    update: SuccessStateApiResponseSchema,
    delete: z.object({ success: z.boolean() })
  }
});

export class SuccessStateClient implements ISuccessStateRepository {
  private readonly mapper: IMapper<SuccessStateCompleteItem, Success>;
  private readonly successStateRepository: HttpZodRepository<SuccessStateCompleteItem>;

  constructor(
    httpClient: ZodHttpClient,
    baseUrl: string = "/successState",
    mapper: IMapper<SuccessStateCompleteItem, Success> = new SuccessCompletMapper()
  ) {
    this.mapper = mapper;

    this.successStateRepository = new HttpZodRepository<SuccessStateCompleteItem>(
      httpClient,
      baseUrl,
      createSuccessRepositoryConfig()
    );
  }

  isCompleted(suc: Success): Promise<boolean> {
    throw new Error("Méthode non implémentée.");
  }

  async create(success: SuccessStateCompleteItem): Promise<void> {
    throw new Error("Méthode non implémentée.");
  }

  async update(id: string, success: SuccessStateCompleteItem): Promise<void> {
    // const dto = this.mapper.toUpdateDto(success);
    // await this.successStateRepository.update(id, dto);
            throw new Error("Méthode non implémentée.");

  }

  async delete(id: string): Promise<void> {
    throw new Error("Méthode non implémentée.");
  }

  async getById(id: string): Promise<SuccessStateCompleteItem> {
    // const dto = await this.successStateRepository.getById(id);
    // return this.mapper.toDomain(dto);
        throw new Error("Méthode non implémentée.");

  }

  async getAll(request: PagedRequest): Promise<PagingResult<SuccessStateCompleteItem>> {
    const dtoResult = await this.successStateRepository.getAll(request);

    return {
      count: dtoResult.count,
      index: dtoResult.index,
      total: dtoResult.total,
      items: dtoResult.items
    };
  }

  async count(filter: FilterPredicate<SuccessStateCompleteItem>): Promise<number> {
    throw new Error("Méthode non implémentée.");
  }
}
