import Capture from "@/model/Capture";

export default class User {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    inscriptionDate: Date;
    captures:Capture[];

    constructor(id: number, username: string, email: string, passwordHash: string, inscriptionDate: Date,captures:Capture[]) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.inscriptionDate = inscriptionDate;
        this.captures=captures;
    }
}
