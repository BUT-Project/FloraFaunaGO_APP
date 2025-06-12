import {IDataManager} from "@/dal/IDataManager";
import NetworkAuthService from "@/dal/network/NetworkAuthService";
import {ZodHttpClient} from "@/dal/network/ZodHttpClient";
import {UserClient} from "@/dal/network/UserClient";
import {SpeciesClient} from "@/dal/network/SpeciesClient";

export default class WebApiClient extends IDataManager{

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
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNjk2MjRiNi1lMTI2LTRmYWEtOTI4Yy1jNmE5YWY0NTg3NDkiLCJlbWFpbCI6InlveW9AZ21haWwuY29tIiwidWlkIjoiZTY5NjI0YjYtZTEyNi00ZmFhLTkyOGMtYzZhOWFmNDU4NzQ5IiwiZXhwIjoxNzQ5NzMzNTgzLCJpc3MiOiJGbG9yYUZhdW5hSXNzdWVyIiwiYXVkIjoiRmxvcmFGYXVuYUlzc3VlciJ9.ephgi65pn8_VtgXajeeUfrVRp9DMpanZRzpTI9VTHio`
            },
            baseUrl: 'https://api.example.com'
        });
    }
}