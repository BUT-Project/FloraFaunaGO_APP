import {ISpeciesRepository} from "@/dal/repository/ISpeciesRepository";
import {IUserRepository} from "@/dal/repository/IUserRepository";
import {ISuccessRepository} from "@/dal/repository/ISuccessRepository";
import {ICaptureRepository} from "@/dal/repository/ICaptureRepository";
import IAuthService from "@/model/service/IAuthService";

export abstract class IDataManager {
    public speciesRepository?: ISpeciesRepository;
    public successRepository?: ISuccessRepository;
    public userRepository?: IUserRepository;
    public captureRepository?: ICaptureRepository;
    public authService?: IAuthService;
}