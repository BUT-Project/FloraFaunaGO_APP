import {FilterPredicate} from "@/dal/StubLib/FilterPredicate";
import {PagingResult} from "@/dal/StubLib/PagingResult";

export abstract class GenericRepository<T> {
    abstract create(item: T): Promise<void>;

    abstract update(id: any, item: T): Promise<void>;

    abstract delete(id: any): Promise<void>;

    abstract getById(id: any): Promise<T>;

    abstract getAll(page: number, pageSize: number): Promise<PagingResult<T>>;

    abstract count(filter: FilterPredicate<T>): Promise<number>;
}