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
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJlbWFpbCI6ImRhdmlkQHBvcG8uZnIiLCJ1aWQiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJleHAiOjE3NTAwMjM0NzAsImlzcyI6IkZsb3JhRmF1bmFJc3N1ZXIiLCJhdWQiOiJGbG9yYUZhdW5hSXNzdWVyIn0.a6ApnX-BGkdkAjulN1qLDQSZQez7MztuaEWtbbmyYzU';

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