import Location from "@/model/Location";

export default class CaptureDetail {
    id: number;
    date: Date;
    shiny: boolean;
    location:Location;

    constructor(id: number, date: Date, shiny: boolean,location:Location) {
        this.id = id;
        this.date = date;
        this.shiny = shiny;
        this.location=location
    }
}