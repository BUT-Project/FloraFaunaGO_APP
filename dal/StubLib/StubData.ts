import {CaptureList, SpecieList, SuccessList, UserList} from "./Data"
import StubCaptures from "@/dal/StubLib/StubCaptures";
import StubUsers from "@/dal/StubLib/StubUsers";
import StubAuth from "@/dal/StubLib/StubAuth";
import {IDataManager} from "@/dal/IDataManager";
import { SuccessClient } from "../network/SuccessClient";
import { ZodHttpClient } from "../network/ZodHttpClient";
import { SuccessStateClient } from "../network/SuccessStateClient";
import { SpeciesClient } from "../network/SpeciesClient";

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
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJlbWFpbCI6ImRhdmlkQHBvcG8uZnIiLCJ1aWQiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJleHAiOjE3NDk5MzcxODUsImlzcyI6IkZsb3JhRmF1bmFJc3N1ZXIiLCJhdWQiOiJGbG9yYUZhdW5hSXNzdWVyIn0.uVvtMkDFeO76kntRZQBOGVa4zehvSqJMTk1Eai12haA"
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
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJlbWFpbCI6ImRhdmlkQHBvcG8uZnIiLCJ1aWQiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJleHAiOjE3NDk5MzcxODUsImlzcyI6IkZsb3JhRmF1bmFJc3N1ZXIiLCJhdWQiOiJGbG9yYUZhdW5hSXNzdWVyIn0.uVvtMkDFeO76kntRZQBOGVa4zehvSqJMTk1Eai12haA"
                }
            }),
            new StubAuth(this.ListUser),
            '/FloraFaunaGo_API/success/state/')
        this.userRepository = new StubUsers(this.ListUser);
        this.captureRepository = new StubCaptures(this.ListCapture,this.ListUser);
        this.speciesRepository = new SpeciesClient(
            new ZodHttpClient({
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJlbWFpbCI6ImRhdmlkQHBvcG8uZnIiLCJ1aWQiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJleHAiOjE3NDk5MzcxODUsImlzcyI6IkZsb3JhRmF1bmFJc3N1ZXIiLCJhdWQiOiJGbG9yYUZhdW5hSXNzdWVyIn0.uVvtMkDFeO76kntRZQBOGVa4zehvSqJMTk1Eai12haA"
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