import { Sucess } from "./Sucess";

export class SucessFactory {
    public static createSuccesses(jsonArray: string): Sucess[] {
        let successes: Sucess[] = [];
        let json = JSON.parse(jsonArray);
        json.forEach((successData: any): void => {
            successes.push(new Sucess(successData.nom, successData.image, successData.description, successData.avancement));
        });
        return successes;
    }
}
