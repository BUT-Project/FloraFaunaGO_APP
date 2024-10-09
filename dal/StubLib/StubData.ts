import {CaptureList, SpecieList, SucessList, UserList} from "./Data"
import StubSpecies from "@/dal/StubLib/StubSpecies";
import StubCaptures from "@/dal/StubLib/StubCaptures";
import StubUsers from "@/dal/StubLib/StubUsers";
import StubSucess from "@/dal/StubLib/StubSucess";

export default class StubData {
    private ListUser = UserList
    private ListCapture = CaptureList
    private ListSpecie = SpecieList
    private ListSucess = SucessList

    public stubSpecies =  new StubSpecies(this.ListSpecie)
    public stubCapture = StubCaptures(this.ListCapture)
    public stubUsers = StubUsers(this.ListUser)
    public stubSucess = StubSucess(this.ListSucess)

}