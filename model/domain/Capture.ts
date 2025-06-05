import CaptureDetail from "@/model/domain/CaptureDetail";
import Specie from "@/model/domain/Specie";
// [TODO] [Dave] need to change Specie to SpecieDetails
export default class Capture {
    id: string;
    photo: string | null;
    specie: Specie;
    capturesDetails:CaptureDetail[];

    constructor(id: string, photo: string | null, specie:Specie,capturesDetails:CaptureDetail[]) {
        this.id = id;
        this.photo = photo;
        this.specie=specie;
        this.capturesDetails=capturesDetails;
    }

}