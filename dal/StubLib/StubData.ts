import {IDataManager} from "@/dal/IDataManager";
import {SuccessClient} from "../network/SuccessClient";
import {ZodHttpClient} from "../network/ZodHttpClient";
import {SuccessStateClient} from "../network/SuccessStateClient";
import {SpeciesClient} from "../network/SpeciesClient";
import {UserClient} from "@/dal/network/UserClient";
import {CapturesClient} from "@/dal/network/CapturesClient";
import {ITokenManager} from "@/services/keyManager/ITokenManager";
import {AccessTokenResponseDto} from "@/shared/scheme/AccessTokenResponseSchema";
import TokenManager from "@/services/keyManager/TokenManager";
import {SecureLocalStorageAdapter} from "@/libs/LocalStorageAdapter";
import NetworkAuthService from "@/dal/network/NetworkAuthService";
import {UserMapper} from "@/shared/mappers/UserMaper";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YWE5NDMzMC03NmEyLTQwNzUtOWY0My01YzNlNjcwNDcxNzciLCJlbWFpbCI6InRlc3RAdC5mciIsInVpZCI6IjRhYTk0MzMwLTc2YTItNDA3NS05ZjQzLTVjM2U2NzA0NzE3NyIsImV4cCI6MTc1MDA2NjI1NSwiaXNzIjoiRmxvcmFGYXVuYUlzc3VlciIsImF1ZCI6IkZsb3JhRmF1bmFJc3N1ZXIifQ.GJee7ORo4GdKu9mMvGqwf6Bwtvo-Ug0KMGEndb1wZoE';

export default class StubData extends IDataManager {
    private static instance: StubData;
    private tokenManager: ITokenManager<AccessTokenResponseDto> = new TokenManager(new SecureLocalStorageAdapter());

    public constructor() {
        super();
        
        // Initialize species repository first
        this.speciesRepository = new SpeciesClient(
            new ZodHttpClient({
                    headers: {
                        'Accept': 'application/json',
                        "Authorization": `Bearer ${ACCESS_TOKEN}`
                    },
                    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api'
                }
            ), '/FloraFaunaGo_API/espece');
        
        // Initialize user repository with species repository for capturing data
        this.userRepository = new UserClient( 
            new ZodHttpClient({
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${ACCESS_TOKEN}`
                },
                baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api'
            }),
            '/FloraFaunaGo_API/utilisateur',
            new UserMapper(this.speciesRepository),
            undefined,
            this.speciesRepository
        );
        //this.successRepository = new StubSucess(this.ListSucess);
        this.authService = new NetworkAuthService(new ZodHttpClient({
            headers: {
                'Accept': 'application/json',
                "Authorization": `Bearer ${ACCESS_TOKEN}`
            },
            baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api',
        })
            ,this.userRepository, this.tokenManager, '/api/Auth');

        this.successRepository = new SuccessClient(
            new ZodHttpClient({
                baseUrl: 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api',
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${ACCESS_TOKEN}`
                }
            }),
            this.authService,
            '/FloraFaunaGo_API/success/');

        this.successStateRepository = new SuccessStateClient(
            new ZodHttpClient({
                baseUrl: 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api',
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${ACCESS_TOKEN}`
                }
            }), this.authService,
            '/FloraFaunaGo_API/success/state/')

        this.speciesRepository = new SpeciesClient(
            new ZodHttpClient({
                    headers: {
                        'Accept': 'application/json',
                        "Authorization": `Bearer ${ACCESS_TOKEN}`
                    },
                    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api'
                }
            ), '/FloraFaunaGo_API/espece');

        this.captureRepository = new CapturesClient(new ZodHttpClient({
            headers: {
                'Accept': 'application/json',
                "Authorization": `Bearer ${ACCESS_TOKEN}`
            },
            baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api'
        }), '/FloraFaunaGo_API/capture');


    }

    static getInstance(): StubData {
        if (!StubData.instance) {
            StubData.instance = new StubData();
        }
        return StubData.instance;
    }
}