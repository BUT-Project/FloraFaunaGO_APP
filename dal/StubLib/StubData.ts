import {CaptureList, SpecieList, SucessList, UserList} from "./Data"
import StubSpecies from "@/dal/StubLib/StubSpecies";
import StubCaptures from "@/dal/StubLib/StubCaptures";
import StubUsers from "@/dal/StubLib/StubUsers";
import StubSucess from "@/dal/StubLib/StubSucess";
import StubAuth from "@/dal/StubLib/StubAuth";

export default class StubData {
    private static instance: StubData;

    private ListUser = UserList
    private ListCapture = CaptureList
    private ListSpecie = SpecieList
    private ListSucess = SucessList

    public Auth = new StubAuth(this.ListUser)
    public Species =  new StubSpecies(this.ListSpecie)
    public Capture = new StubCaptures(this.ListCapture)
    public Users = new StubUsers(this.ListUser)
    public Sucess = new StubSucess(this.ListSucess)

    static getInstance():StubData{
        if(!StubData.instance){
            StubData.instance = new StubData();
        }
        return StubData.instance;
    }
}