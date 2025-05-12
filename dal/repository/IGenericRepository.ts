import {FilterPredicate} from "@/shared/FilterPredicate";
import {PagingResult} from "@/shared/PagingResult";
import {PagedRequest} from "@/shared/PagedRequest";

export abstract class GenericRepository<T> {
    abstract create(item: T): Promise<void>;

    abstract update(id: any, item: T): Promise<void>;

    abstract delete(id: any): Promise<void>;

    abstract getById(id: any): Promise<T>;

    abstract getAll(request: PagedRequest): Promise<PagingResult<T>>;

    abstract count(filter: FilterPredicate<T>): Promise<number>;
}