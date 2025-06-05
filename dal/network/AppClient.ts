import {IDataManager} from "@/dal/IDataManager";
import NetworkAuthService from "@/dal/network/NetworkAuthService";
import {ZodHttpClient} from "@/dal/network/ZodHttpClient";
import {UserClient} from "@/dal/network/UserClient";
import {SpeciesClient} from "@/dal/network/SpeciesClient";

export default class AppClient extends IDataManager{

    private client : ZodHttpClient | undefined;

    public constructor() {
        super();
        this.client = this.buildClient();
        this.userRepository = new UserClient(this.client, '/api/utilisateur');
        this.speciesRepository = new SpeciesClient(this.client, '/api/espece');
        this.authService = new NetworkAuthService(this.client,this.userRepository);
    }

    private buildClient(): ZodHttpClient {
        if (this.client) {
            return this.client;
        }
        // Use ZodHttpClient for schema validation
        return new ZodHttpClient({
            baseUrl: 'https://api.example.com'
        });
    }
}