import {FilterPredicate} from "@/dal/FilterPredicate";

export abstract class GenericRepository<T> {
    abstract create(item: T): Promise<void>;

    abstract update(id: string, item: T): Promise<void>;

    abstract delete(id: string): Promise<void>;

    abstract getById(id: string): Promise<T>;

    abstract getAll(request: PagedRequest,filter: FilterPredicate<T>): Promise<PagingResult<T>>;

    abstract count(filter: FilterPredicate<T>): Promise<number>;
}
