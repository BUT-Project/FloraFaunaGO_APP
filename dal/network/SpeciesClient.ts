import { PagingResultSpecieSchema, SpecieDto, SpecieDtoSchema } from "@/shared/scheme/SpecieDtoSchema";
import { ISpeciesRepository } from "../repository/ISpeciesRepository";
import { Family, Specie } from "@/model/domain";
import { ZodHttpClient } from "./ZodHttpClient";
import { IMapper } from "@/shared/mappers/IMapper";
import { FilterPredicate } from "@/shared/FilterPredicate";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { SpecieMapper } from "@/shared/mappers/SpecieMapper";
import {HttpZodRepository, HttpZodRepositoryConfig} from "@/dal/network/NetworkGenericClient";
import z from "zod";


const createSpecieRepositoryConfig = (): HttpZodRepositoryConfig<SpecieDto> => ({
    responceSchema: SpecieDtoSchema
});

export class SpeciesClient implements ISpeciesRepository {
    private readonly mapper: IMapper<SpecieDto, Specie>;

    constructor(
        private httpClient: ZodHttpClient,
        private baseUrl: string = '/espece',
        mapper: IMapper<SpecieDto, Specie> = new SpecieMapper(),
        private speciesRepository : HttpZodRepository<SpecieDto> = new HttpZodRepository<SpecieDto>(httpClient, baseUrl,createSpecieRepositoryConfig())
    ) {
        this.mapper = mapper;
    }
    async identifySpecies(imageBase64: string): Promise<Specie> {
        const identifySpecieResult = await this.httpClient.postValidated(this.baseUrl+'/identify', { imageBase64 }, z.object({ imageBase64: z.string() }), SpecieDtoSchema);

        if (!identifySpecieResult.success) {
            throw identifySpecieResult.error;
        }

        return this.mapper.toDomain(identifySpecieResult.data);
    }
    async getByFamily(family: Family, page: number, pageSize: number, selfId?: number): Promise<PagingResult<Specie>> {
        const resultData = await this.httpClient.getValidated(
            this.baseUrl+`/famille=${family}`,
            PagingResultSpecieSchema,
            undefined,
            {index: page,count: pageSize}
        );
        
        if (!resultData.success) {
            throw resultData.error;
        }
        const pagingResult = resultData.data;
        const mappedSpecies = pagingResult.items.map(specieDto => this.mapper.toDomain(specieDto));

        return {
            items: mappedSpecies,
            index: pagingResult.index,
            count: pagingResult.count,
            total: pagingResult.total
        };
    
    }

    create(item: Specie): Promise<void> {
        throw new Error("Method not implemented.");
    }

    update(id: any, item: Specie): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getById(id: any): Promise<Specie> {
        const specie = await this.speciesRepository.getById(id)
        return this.mapper.toDomain(specie);
    }
    async getAll(request: PagedRequest): Promise<PagingResult<Specie>> {
        const pagingResult = await this.speciesRepository.getAll(request);
        const mappedSpecies = pagingResult.items.map(specieDto => this.mapper.toDomain(specieDto));
        return {
            items: mappedSpecies,
            index: pagingResult.index,
            count: pagingResult.count,
            total: pagingResult.total
        };
    }
    count(filter: FilterPredicate<Specie>): Promise<number> {
        throw new Error("Method not implemented.");
    }

}