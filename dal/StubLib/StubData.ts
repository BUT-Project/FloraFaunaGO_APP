import {CaptureList, SpecieList, SuccessList, UserList} from "./Data"
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
        this.speciesRepository = new SpeciesClient(
            new ZodHttpClient({
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNjk2MjRiNi1lMTI2LTRmYWEtOTI4Yy1jNmE5YWY0NTg3NDkiLCJlbWFpbCI6InlveW9AZ21haWwuY29tIiwidWlkIjoiZTY5NjI0YjYtZTEyNi00ZmFhLTkyOGMtYzZhOWFmNDU4NzQ5IiwiZXhwIjoxNzQ5NzM3Mjk0LCJpc3MiOiJGbG9yYUZhdW5hSXNzdWVyIiwiYXVkIjoiRmxvcmFGYXVuYUlzc3VlciJ9.zQUsPQPiLYdsZvhMVfPIvq3e4sDXt5f1JZE4c8S-AQ0"
                },
                baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api'}
            ), '/FloraFaunaGo_API/espece');
        this.authService = new StubAuth(this.ListUser);
    }

    static getInstance():StubData{
        if(!StubData.instance){
            StubData.instance = new StubData();
        }
        return StubData.instance;
    }
}