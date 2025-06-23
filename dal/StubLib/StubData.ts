import {CaptureList, SpecieList, SuccessList, UserList} from "./Data"
import StubSpecies from "@/dal/StubLib/StubSpecies";
import StubCaptures from "@/dal/StubLib/StubCaptures";
import StubUsers from "@/dal/StubLib/StubUsers";
import StubSucess from "@/dal/StubLib/StubSucess";
import StubAuth from "@/dal/StubLib/StubAuth";
import {IDataManager} from "@/dal/IDataManager";

export default class StubData extends IDataManager{
    private ListUser = UserList
    private ListCapture = CaptureList
    private ListSpecie = SpecieList
    private ListSucess = SuccessList

    public constructor() {
        super();
        this.successRepository = new StubSucess(this.ListSucess);
        this.userRepository = new StubUsers(this.ListUser);
        this.captureRepository = new StubCaptures(this.ListCapture,this.ListUser);
        this.speciesRepository = new StubSpecies(this.ListSpecie);
        this.authService = new StubAuth(this.ListUser);
    }
}