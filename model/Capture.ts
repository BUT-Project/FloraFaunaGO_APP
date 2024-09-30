import CaptureDetail from "@/model/CaptureDetail";

export default class Capture {
    id: number;
    photo: string;
    capturesDetails:Array<CaptureDetail>;

    constructor(id: number, photo: string,capturesDetails:Array<CaptureDetail>) {
        this.id = id;
        this.photo = photo;
        this.capturesDetails=capturesDetails;
    }

}