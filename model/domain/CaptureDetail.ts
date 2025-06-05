import Location from "@/model/domain/Location";

export default class CaptureDetail {
    id: string;
    date: Date;
    shiny: boolean;
    location:Location;

    constructor(id: string, date: Date, shiny: boolean,location:Location) {
        this.id = id;
        this.date = date;
        this.shiny = shiny;
        this.location=location
    }
}