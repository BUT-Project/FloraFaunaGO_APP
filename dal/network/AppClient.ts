import {IDataManager} from "@/dal/IDataManager";
import NetworkAuthService from "@/dal/network/NetworkAuthService";
import {ZodHttpClient} from "@/dal/network/ZodHttpClient";
import {UserClient} from "@/dal/network/UserClient";

export default class AppClient extends IDataManager{

    private static instance: IDataManager;
    private client : ZodHttpClient | undefined;

    public constructor() {
        super();
        this.client = this.buildClient();
        this.userRepository = new UserClient(this.client, '/api/utilisateur');
        this.authService = new NetworkAuthService(this.client,this.userRepository);
    }

    static getInstance():IDataManager{
        if(!AppClient.instance){
            AppClient.instance = new AppClient();
        }
        return AppClient.instance;
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