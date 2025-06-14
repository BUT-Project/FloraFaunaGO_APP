import {IDataManager} from "@/dal/IDataManager";
import NetworkAuthService from "@/dal/network/NetworkAuthService";
import {AuthenticatedZodHttpClient} from "@/dal/network/AuthenticatedZodHttpClient";
import {UserClient} from "@/dal/network/UserClient";
import {SpeciesClient} from "@/dal/network/SpeciesClient";
import TokenManager from "@/services/keyManager/TokenManager";
import {SecureLocalStorageAdapter} from "@/libs/LocalStorageAdapter";
import {ZodHttpClient} from "@/dal/network/ZodHttpClient";
import {ITokenManager} from "@/services/keyManager/ITokenManager";
import {AccessTokenResponseDto} from "@/shared/scheme/AccessTokenResponseSchema";

export default class WebApiClient extends IDataManager{

    private client: ZodHttpClient;
    private tokenManager: ITokenManager<AccessTokenResponseDto> = new TokenManager(new SecureLocalStorageAdapter());

    public constructor() {
        super();
        this.client = this.buildAuthenticatedClient();
        this.userRepository = new UserClient(this.client, '/api/utilisateur');
        this.speciesRepository = new SpeciesClient(this.client, '/api/espece');
        this.authService = new NetworkAuthService(this.client,this.userRepository, this.tokenManager);
    }

    private buildAuthenticatedClient(): AuthenticatedZodHttpClient {
        return new AuthenticatedZodHttpClient({
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api'
        }, this.tokenManager);
    }
}