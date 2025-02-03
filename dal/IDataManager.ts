import {ISpeciesRepository} from "@/model/service/ISpeciesRepository";
import {IUserRepository} from "@/model/service/IUserRepository";
import {ISuccessRepository} from "@/model/service/ISuccessRepository";
import {ICaptureRepository} from "@/model/service/ICaptureRepository";
import IAuthService from "@/model/service/IAuthService";

export abstract class IDataManager {
    public speciesRepository?: ISpeciesRepository;
    public successRepository?: ISuccessRepository;
    public userRepository?: IUserRepository;
    public captureRepository?: ICaptureRepository;
    public authService?: IAuthService;
}