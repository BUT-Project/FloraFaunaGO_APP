import {GenericRepository} from "@/dal/repository/IGenericRepository";
import {Success} from "@/model/domain/Success";

export interface ISuccessRepository extends GenericRepository<Success> {
    isCompleted(suc:Success):Promise<Boolean>

}


