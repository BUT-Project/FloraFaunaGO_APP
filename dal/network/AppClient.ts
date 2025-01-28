import {IDataManager} from "@/dal/IDataManager";

export default class AppClient extends IDataManager{

    private static instance: IDataManager;

    public constructor() {
        super();
    }

    static getInstance():AppClient{
        if(!AppClient.instance){
            AppClient.instance = new AppClient();
        }
        return AppClient.instance;
    }

}