import {GenericRepository} from "@/dal/repository/IGenericRepository";
import {Success} from "@/model/domain/Success";

export interface ISuccessRepository extends GenericRepository<Success> {

}

export interface SuccessFilterPredicate {
    filterByName: (name: string) => void;
    filterByProgress: (minProgress: number, maxProgress: number) => void;
    sortByName: (descending?: boolean) => void;
    sortByProgress: (descending?: boolean) => void;
    clearFilters: () => void;
}
