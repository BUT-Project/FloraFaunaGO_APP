export default class Location{
    latitude:number;
    longitude:number;
    altitude:number;
    radius:number;
    accuracy:number;

    constructor(latitude: number, longitude: number, altitude: number, radius: number, accuracy: number) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.radius = radius;
        this.accuracy = accuracy;
    }
}