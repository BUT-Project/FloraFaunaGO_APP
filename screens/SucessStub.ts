import { Sucess } from "./Sucess";
import { SucessFactory } from "./SucessFactory";

// Exemples de données de succès
const SUCCESSES = [
    {
        "nom": "Succès A",
        "image": "https://placekitten.com/400/400?image=1",
        "description": "Description du succès A",
        "avancement": 20
    },
    {
        "nom": "Succès B",
        "image": "https://placekitten.com/400/400?image=2",
        "description": "Description du succès B",
        "avancement": 50
    },
    {
        "nom": "Succès C",
        "image": "https://placekitten.com/400/400?image=3",
        "description": "Description du succès C",
        "avancement": 80
    },
    {
        "nom": "Succès D",
        "image": "https://placekitten.com/400/400?image=1",
        "description": "Description du succès A",
        "avancement": 20
    },
    {
        "nom": "Succès E",
        "image": "https://placekitten.com/400/400?image=2",
        "description": "Description du succès B",
        "avancement": 50
    },
    {
        "nom": "Succès F",
        "image": "https://placekitten.com/400/400?image=3",
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
