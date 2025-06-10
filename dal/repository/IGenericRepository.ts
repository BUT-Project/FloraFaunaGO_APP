import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import {PagedRequest} from "@/shared/PagedRequest";

export abstract class GenericRepository<T> {
    abstract create(item: T): Promise<void>;

    abstract update(id: string, item: T): Promise<void>;

    abstract delete(id: string): Promise<void>;

    abstract getById(id: string): Promise<T>;

    abstract getAll(request: PagedRequest): Promise<PagingResult<Partial<T>>>;

    abstract count(filter: FilterPredicate<T>): Promise<number>;
}