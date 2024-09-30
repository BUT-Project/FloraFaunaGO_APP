import CaptureDetail from "@/model/CaptureDetail";
import Specie from "@/model/Specie";

export default class Capture {
    id: number;
    photo: string;
    specie: Specie;
    capturesDetails:CaptureDetail[];

    constructor(id: number, photo: string, specie:Specie,capturesDetails:CaptureDetail[]) {
        this.id = id;
        this.photo = photo;
        this.specie=specie;
        this.capturesDetails=capturesDetails;
    }

}