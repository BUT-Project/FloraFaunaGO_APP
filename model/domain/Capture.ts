import CaptureDetail from "@/model/domain/CaptureDetail";
import Specie from "@/model/domain/Specie";

export default class Capture {
    id: number;
    photo: string | null;
    specie: Specie;
    capturesDetails:CaptureDetail[];

    constructor(id: number, photo: string | null, specie:Specie,capturesDetails:CaptureDetail[]) {
        this.id = id;
        this.photo = photo;
        this.specie=specie;
        this.capturesDetails=capturesDetails;
    }

}