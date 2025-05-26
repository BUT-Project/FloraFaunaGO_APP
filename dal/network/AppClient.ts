import {IDataManager} from "@/dal/IDataManager";
import StubAuth from "@/dal/StubLib/StubAuth";
import NetworkAuthService from "@/dal/network/NetworkAuthService";
import {GenericClient} from "@/dal/network/GenericHttpClient";

export default class AppClient extends IDataManager{

    private static instance: IDataManager;
    private client : GenericClient;

    public constructor() {
        super();
        this.client = new GenericClient("");
    }

    static getInstance():AppClient{
        if(!AppClient.instance){
            AppClient.instance = new AppClient();
        }
        return AppClient.instance;
    }
}