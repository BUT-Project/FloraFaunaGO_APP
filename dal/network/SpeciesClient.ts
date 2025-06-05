import {
    FullSpecieDto, FullSpecieDtoSchema,
    PagingResultSpecieSchema,
    SpecieDto,
    SpecieDtoSchema
} from "@/shared/scheme/SpecieDtoSchema";
import { ISpeciesRepository } from "../repository/ISpeciesRepository";
import { Family, Specie } from "@/model/domain";
import { ZodHttpClient } from "./ZodHttpClient";
import { IMapper } from "@/shared/mappers/IMapper";
import { FilterPredicate } from "@/shared/FilterPredicate";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { SpecieMapper } from "@/shared/mappers/SpecieMapper";
import {HttpZodResourceClient} from "@/dal/network/NetworkGenericClient";
import z from "zod";

export class SpeciesClient implements ISpeciesRepository {
    constructor(
        private readonly httpClient: ZodHttpClient,
        private baseUrl: string = '/espece',
        private specieMapper: IMapper<SpecieDto, Specie> = new SpecieMapper(),
        private speciesHttpClient : HttpZodResourceClient<SpecieDto,FullSpecieDto> = HttpZodResourceClient.create<SpecieDto,FullSpecieDto>(httpClient, baseUrl,SpecieDtoSchema,FullSpecieDtoSchema)
    ) {}

    async identifySpecies(imageBase64: string): Promise<Specie> {
        const identifySpecieResult = await this.httpClient.postValidated(this.baseUrl+'/identify', { imageBase64 }, z.object({ imageBase64: z.string() }), SpecieDtoSchema);

        if (!identifySpecieResult.success) {
            throw identifySpecieResult.error;
        }

        return this.specieMapper.toDomain(identifySpecieResult.data);
    }
    async getByFamily(family: Family, page: number, pageSize: number, selfId?: number): Promise<PagingResult<Specie>> {
        const resultData = await this.httpClient.getValidated(
            this.baseUrl + `/famille=${family}`,
            PagingResultSpecieSchema,
            undefined,
            {index: page,count: pageSize}
        );
        
        if (!resultData.success) {
            throw resultData.error;
        }
        const pagingResult = resultData.data;
        const mappedSpecies = pagingResult.items.map(this.specieMapper.toDomain);

        return {
            items: mappedSpecies,
            index: pagingResult.index,
            count: pagingResult.count,
            total: pagingResult.total
        };
    
    }
    async getById(id: any): Promise<Specie> {
        const specie = await this.speciesHttpClient.getById(id)
        return this.specieMapper.toDomain(specie);
    }

    async getAll(request: PagedRequest): Promise<PagingResult<Specie>> {
        const pagingResult = await this.speciesHttpClient.getAll(request);
        const mappedSpecies = pagingResult.items.map(this.specieMapper.toDomain);
        return {
            items: mappedSpecies,
            index: pagingResult.index,
            count: pagingResult.count,
            total: pagingResult.total
        };
    }

    // Methods from ISpeciesRepository that are not implemented by choice

    create(item: Specie): Promise<void> {
        throw new Error("Method not implemented.");
    }

    update(id: any, item: Specie): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

    count(filter: FilterPredicate<Specie>): Promise<number> {
        throw new Error("Method not implemented.");
    }
}