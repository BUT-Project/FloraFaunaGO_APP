import {GenericRepository} from "@/model/service/IGenericRepository";
import User from "@/model/domain/User";

export interface IUserRepository extends GenericRepository<User> {
}