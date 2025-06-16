import {
    PagingResultSpecieSchema,
    SpecieDto,
    SpecieListDto,
    SpecieDtoSchema,
    SpecieListDtoSchema
} from "@/shared/scheme/SpecieDtoSchema";
import { ISpeciesRepository } from "../repository/ISpeciesRepository";
import { Specie,SpecieType } from "@/model/domain";
import { ZodHttpClient } from "./ZodHttpClient";
import { IMapper } from "@/shared/mappers/IMapper";
import { FilterPredicate } from "@/shared/FilterPredicate";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { SpecieMapper} from "@/shared/mappers/SpecieMapper";
import {HttpZodResourceClient} from "@/dal/network/HttpZodResourceClient";
import z from "zod";

export class SpeciesClient implements ISpeciesRepository {
    constructor(
        private readonly httpClient: ZodHttpClient,
        private baseUrl: string = '/espece',
        private specieMapper: IMapper<SpecieDto, Specie,SpecieListDto> = new SpecieMapper(),
        private speciesHttpClient : HttpZodResourceClient<SpecieDto,SpecieListDto> = HttpZodResourceClient.create<SpecieDto,SpecieListDto>(httpClient, baseUrl,SpecieDtoSchema,{listItemSchema:SpecieListDtoSchema})
    ) {}

    async identifySpecies(imageBase64: string): Promise<Specie> {
        
        console.log("image laalalal", imageBase64.slice(0,100));
        const identifySpecieResult = await this.httpClient.postValidated(`/FloraFaunaGo_API/identification?especeType=${SpecieType.Insect}`, { askedImage : imageBase64 }, z.object({ askedImage: z.string() }), SpecieDtoSchema);

        if (!identifySpecieResult.success) {
            throw identifySpecieResult.error;
        }

        return this.specieMapper.toDomain(identifySpecieResult.data);
    }

    // TODO: [YOAN] DES que il on fait la route /espece/{id}/related, on peut l'utiliser pour les espèces liées par famille et adapte le code
    async getRelatedSpeciesByFamily(specieId: string, request : PagedRequest): Promise<PagingResult<Specie>> {
        const resultData = await this.httpClient.getValidated(
            `${this.baseUrl}/${specieId}/related`,
            PagingResultSpecieSchema,
            undefined,
            {index: request.index,count: request.count}
        );

        if (!resultData.success) {
            throw resultData.error;
        }
        const pagingResult = resultData.data;
        const mappedSpecies = this.specieMapper.toDomains(pagingResult.items);

        return {
            items: mappedSpecies,
            index: pagingResult.index,
            count: pagingResult.count,
            total: pagingResult.total
        };

    }
    async getById(id: string): Promise<Specie> {
        const specie = await this.speciesHttpClient.getById(id)
        return this.specieMapper.toDomain(specie);
    }

    async getAll(request: PagedRequest): Promise<PagingResult<Specie>> {
        const pagingResult = await this.speciesHttpClient.getAll(request);
        const mappedSpecies = this.specieMapper.toDomains(pagingResult.items);
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

    update(id: string, item: Specie): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    count(filter: FilterPredicate<Specie>): Promise<number> {
        throw new Error("Method not implemented.");
    }
}