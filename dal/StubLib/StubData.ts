import {CaptureList, SpecieList, SuccessList, UserList} from "./Data"
import StubSpecies from "@/dal/StubLib/StubSpecies";
import StubCaptures from "@/dal/StubLib/StubCaptures";
import StubUsers from "@/dal/StubLib/StubUsers";
import StubSucess from "@/dal/StubLib/StubSucess";
import StubAuth from "@/dal/StubLib/StubAuth";
import {IDataManager} from "@/dal/IDataManager";
import { SpeciesClient } from "../network/SpeciesClient";
import { ZodHttpClient } from "../network/ZodHttpClient";

export default class StubData extends IDataManager{
    private static instance: StubData;

    private ListUser = UserList
    private ListCapture = CaptureList
    private ListSpecie = SpecieList
    private ListSucess = SuccessList

    public constructor() {
        super();
        this.successRepository = new StubSucess(this.ListSucess);
        this.userRepository = new StubUsers(this.ListUser);
        this.captureRepository = new StubCaptures(this.ListCapture,this.ListUser);
        this.speciesRepository = new SpeciesClient(new ZodHttpClient({
                    baseUrl: 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api'
                }), '/FloraFaunaGo_API/espece');
        this.authService = new StubAuth(this.ListUser);
    }

    static getInstance():StubData{
        if(!StubData.instance){
            StubData.instance = new StubData();
        }
        return StubData.instance;
    }




}