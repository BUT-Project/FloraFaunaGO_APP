import {ZodHttpClient} from "@/dal/network/ZodHttpClient";

import {SuccessStateCompleteItem, SuccessStateCompleteItemSchema} from "@/shared/scheme/SuccessStateNormalDtoSchema";
import {z} from "zod";
import {SuccessCompletMapper} from "@/shared/mappers/SuccessCompletMapper";
import {Success} from "@/model/domain/Success";
import {PagedRequest} from "@/shared/PagedRequest";
import {PagingResult} from "@/shared/PagingResult";
import {FilterPredicate} from "@/shared/FilterPredicate";
import {IMapper} from "@/shared/mappers/IMapper";
import {ISuccessStateRepository} from "../repository/ISuccessStateRepository";
import IAuthService from "@/model/service/IAuthService";
import {HttpZodResourceClient} from "@/dal/network/HttpZodResourceClient";

export class SuccessStateClient implements ISuccessStateRepository {
    private readonly successStateRepository: HttpZodResourceClient<SuccessStateCompleteItem>;

    constructor(
        private httpClient: ZodHttpClient,
        private authService: IAuthService,
        baseUrl: string = "/success/state",
        mapper: IMapper<SuccessStateCompleteItem, Success> = new SuccessCompletMapper()
    ) {
        this.successStateRepository = HttpZodResourceClient.create<SuccessStateCompleteItem>(
            httpClient,
            baseUrl,
            SuccessStateCompleteItemSchema
        );
    }

    async create(success: SuccessStateCompleteItem): Promise<void> {
        throw new Error("Méthode non implémentée.");
    }

    async update(id: string, success: SuccessStateCompleteItem): Promise<void> {
        //await this.successStateRepository.update(id, success);
        const endpoint = `/FloraFaunaGo_API/success/state/${id}`;
        const body = {
            id,
            percentSucces: success.state.percentSucces,
        };

        await this.httpClient.put(endpoint, body);

    }

    async delete(id: string): Promise<void> {
        throw new Error("Méthode non implémentée.");
    }

    async getById(id: string): Promise<SuccessStateCompleteItem> {
        const dto = await this.successStateRepository.getById(id);
        //return this.mapper.toDomain(dto);
        return {
            state: {
                id: dto.state.id,
                percentSucces: dto.state.percentSucces,
                isSucces: dto.state.isSucces
            },
            success: dto.success,
            user: dto.user
        };
    }

    async getAll(request: PagedRequest): Promise<PagingResult<SuccessStateCompleteItem>> {

        //a modifier [Patrick]
         const user = await this.authService.getUser();
         if (!user) {
            throw new Error("User not authenticated while fetching success states.");
         }
         const endpoint = `/FloraFaunaGo_API/success/state/idUser=${user.id}` // #TODO REmove hardcoded user ID and use authService to get current user ID
        const dtoResult = await this.httpClient.getValidated(
            endpoint,
            z.object({
                count: z.number(),
                index: z.number(),
                total: z.number(),
                items: z.array(SuccessStateCompleteItemSchema)
            }),
            undefined,
            {index: request.index, count: request.count}
        );
        if (!dtoResult.success) {
            throw dtoResult.error;
        }

        return {
            count: dtoResult.data.count,
            index: dtoResult.data.index,
            total: dtoResult.data.total,
            items: dtoResult.data.items
        };
    }

    async count(filter: FilterPredicate<SuccessStateCompleteItem>): Promise<number> {
        throw new Error("Méthode non implémentée.");
    }
}
