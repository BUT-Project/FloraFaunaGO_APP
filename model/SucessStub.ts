import { Sucess } from "./Sucess";
import { SucessFactory } from "./SucessFactory";

const SUCCESSES = [
    {
        "nom": "Succès A",
        "image": "checkmark-circle-outline",
        "description": "Description du succès A",
        "avancement": 20
    },
    {
        "nom": "Succès B",
        "image": "checkmark-circle-outline",
        "description": "Description du succès B",
        "avancement": 50
    },
    {
        "nom": "Succès C",
        "image": "checkmark-circle-outline",
        "description": "Description du succès C",
        "avancement": 80
    },
    {
        "nom": "Succès D",
        "image": "checkmark-circle-outline",
        "description": "Description du succès A",
        "avancement": 20
    },
    {
        "nom": "Succès E",
        "image": "checkmark-circle-outline",
        "description": "Description du succès B",
        "avancement": 50
    },
    {
        "nom": "Succès F",
        "image": "checkmark-circle-outline",
        "description": "Description du succès C",
        "avancement": 80
    }
];



export class SucessStub {
    public getSuccesses(): Sucess[] {
        const sampleSuccesses = JSON.stringify(SUCCESSES);
        return SucessFactory.createSuccesses(sampleSuccesses);
    }

}
