import {GenericRepository} from "@/dal/repository/IGenericRepository";
import {Success} from "@/model/domain/Success";

export interface ISuccessRepository extends GenericRepository<Success> {
    // sois overide la méthode ou en crée une autre qui pour quand un suces est update il me dit si il est completed ou pas 


}

export interface SuccessFilterPredicate {
    filterByName: (name: string) => void;
    filterByProgress: (minProgress: number, maxProgress: number) => void;
    sortByName: (descending?: boolean) => void;
    sortByProgress: (descending?: boolean) => void;
    clearFilters: () => void;
}
