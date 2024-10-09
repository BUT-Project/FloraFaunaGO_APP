import {SpeciesRepository} from "@/dal/SpeciesRepository";
import Specie from "@/model/Specie";
import {FilterPredicate} from "@/dal/FilterPredicate";

export class SpeciesClient extends GenericClient implements SpeciesRepository {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async create(item: Specie): Promise<void> {
        await this.request<void>('/species', 'POST', item);
    }

    async getById(id: string): Promise<Specie> {
        return await this.request<Specie>(`/species/${id}`, 'GET');
    }

    async update(id: string, item: Specie): Promise<void> {
        await this.request<void>(`/species/${id}`, 'PUT', item);
    }

    async delete(id: string): Promise<void> {
        await this.request<void>(`/species/${id}`, 'DELETE');
    }

    async getAll(request: PagedRequest, filter: FilterPredicate<Specie>): Promise<PagingResult<Specie>> {
        const queryParams = new URLSearchParams(
        //     {
        //     ...this.serializeFilter(filter),
        //     ...request
        // }
        );
        return await this.request<PagingResult<Specie>>(`/species?${queryParams}`, 'GET');
    }

    async count(filter: FilterPredicate<Specie>): Promise<number> {
        const queryParams = new URLSearchParams(this.serializeFilter(filter));
        return await this.request<number>(`/species/count?${queryParams}`, 'GET');
    }

    private serializeFilter(filter: FilterPredicate<Specie>): Record<string, string> {
        // Implement filter serialization logic here
        // This is a placeholder and should be implemented based on your specific filter structure
        return {};
    }
}