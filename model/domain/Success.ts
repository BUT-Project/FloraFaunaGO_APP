export class Success {
    nom: string
    image: string
    actualVal:number
    objectif: number
    description: string
    event : string

    public constructor(nom: string, image: string, description: string, actualVal: number,objectif:number,event:string) {
        this.nom = nom
        this.image = image
        this.description = description
        this.actualVal = actualVal
        this.objectif = objectif
        this.event = event
    }

}




