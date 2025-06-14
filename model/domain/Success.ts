import { SuccessType } from "./SuccessType"

export class Success {
    id:string
    nom: string
    image: string
    actualVal:number
    objectif: number
    description: string
    type: SuccessType
    event : string

    public constructor(id:string,nom: string, image: string, description: string, actualVal: number,objectif:number,type:SuccessType,event:string) {
        this.id = id
        this.nom = nom
        this.image = image
        this.description = description
        this.actualVal = actualVal
        this.objectif = objectif
        this.event = event
        this.type = type
    }

}




