import Capture from "@/model/domain/Capture";
import {Success} from "@/model/domain/Success";

export default class User {
    id: number
    username: string
    email: string
    passwordHash: string
    inscriptionDate: Date
    stepCount : number
    captures:Capture[] // [DAVE] [TODO] les amis on va supprimer sa sert à rienn
    _success:Success[]

    constructor(id: number, username: string, email: string, passwordHash: string, inscriptionDate: Date,captures:Capture[],success:Success[],stepCount:number = 0) {
        this.id = id
        this.username = username
        this.email = email
        this.passwordHash = passwordHash
        this.inscriptionDate = inscriptionDate
        this.captures=captures
        this._success = success
        this.stepCount = stepCount
    }
}
