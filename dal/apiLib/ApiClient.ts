import {SpeciesRepository} from "@/dal/SpeciesRepository";
import {AppFacade} from "@/dal/AppFacade";
import {SpeciesClient} from "@/dal/apiLib/SpeciesClient";

export class ApiClient extends AppFacade{
    private readonly API_URL = "https://codefirst.iut.uca.fr/git/FloraFauna_GO/FloraFauna_GO_API";
    private readonly apiClient = new ApiClient();
    constructor() {
        super();
        this.speciesRepository = new SpeciesClient();
    }
}