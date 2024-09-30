import {Climate} from "@/model/Climate";

export default class Habitat{
    zone: string;
    climate: Climate;

    constructor(zone: string, climate: Climate) {
        this.zone = zone;
        this.climate = climate;
    }
}