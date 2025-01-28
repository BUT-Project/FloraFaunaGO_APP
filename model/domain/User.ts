import Capture from "@/model/domain/Capture";

export default class User {
    id: number
    username: string
    email: string
    passwordHash: string
    inscriptionDate: Date
    captures:Capture[]
    _success:Sucess[]

    constructor(id: number, username: string, email: string, passwordHash: string, inscriptionDate: Date,captures:Capture[],success:Sucess[]) {
        this.id = id
        this.username = username
        this.email = email
        this.passwordHash = passwordHash
        this.inscriptionDate = inscriptionDate
        this.captures=captures
        this.success = success
    }
}
