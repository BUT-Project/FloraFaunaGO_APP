import {GenericRepository} from "@/model/service/IGenericRepository";
import User from "@/model/domain/User";
import Specie from "@/model/domain/Specie";
import CaptureDetail from "@/model/domain/CaptureDetail";
import Capture from "@/model/domain/Capture";

export interface IUserRepository extends GenericRepository<User> {
}