import {CaptureList, SpecieList, SuccessList, UserList} from "./Data"
import StubSpecies from "@/dal/StubLib/StubSpecies";
import StubCaptures from "@/dal/StubLib/StubCaptures";
import StubUsers from "@/dal/StubLib/StubUsers";
import StubSucess from "@/dal/StubLib/StubSucess";
import StubAuth from "@/dal/StubLib/StubAuth";
import {IDataManager} from "@/dal/IDataManager";
import { SuccessClient } from "../network/SuccessClient";
import { ZodHttpClient } from "../network/ZodHttpClient";
import { SuccessStateClient } from "../network/SuccessStateClient";

export default class StubData extends IDataManager{
    private static instance: StubData;

    private ListUser = UserList
    private ListCapture = CaptureList
    private ListSpecie = SpecieList
    private ListSucess = SuccessList

    public constructor() {
        super();
        //this.successRepository = new StubSucess(this.ListSucess);
        this.successRepository = new SuccessClient(
            new ZodHttpClient({
                baseUrl: 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMTllYTEwOC04YWY4LTQxNGItYTRjNy1mMTJjZjQ0ZjUyNDciLCJlbWFpbCI6InRlc3RAdGVzdC5mciIsInVpZCI6IjIxOWVhMTA4LThhZjgtNDE0Yi1hNGM3LWYxMmNmNDRmNTI0NyIsImV4cCI6MTc0OTg1MTIxOCwiaXNzIjoiRmxvcmFGYXVuYUlzc3VlciIsImF1ZCI6IkZsb3JhRmF1bmFJc3N1ZXIifQ.RXDXavrsIqJ39XYlpWPwyYcUkPIi2RYV7VtpWc90KAY"
                }
            }),
            new StubAuth(this.ListUser),
            '/FloraFaunaGo_API/success/')
            this.successStateRepository = new SuccessStateClient(
            new ZodHttpClient({
                baseUrl: 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMTllYTEwOC04YWY4LTQxNGItYTRjNy1mMTJjZjQ0ZjUyNDciLCJlbWFpbCI6InRlc3RAdGVzdC5mciIsInVpZCI6IjIxOWVhMTA4LThhZjgtNDE0Yi1hNGM3LWYxMmNmNDRmNTI0NyIsImV4cCI6MTc0OTg1MTIxOCwiaXNzIjoiRmxvcmFGYXVuYUlzc3VlciIsImF1ZCI6IkZsb3JhRmF1bmFJc3N1ZXIifQ.RXDXavrsIqJ39XYlpWPwyYcUkPIi2RYV7VtpWc90KAY"
                }
            }),            
            new StubAuth(this.ListUser),
            '/FloraFaunaGo_API/success/state/')
        this.userRepository = new StubUsers(this.ListUser);
        this.captureRepository = new StubCaptures(this.ListCapture,this.ListUser);
        this.speciesRepository = new StubSpecies(this.ListSpecie);
        this.authService = new StubAuth(this.ListUser);
    }

    static getInstance():StubData{
        if(!StubData.instance){
            StubData.instance = new StubData();
        }
        return StubData.instance;
    }




}