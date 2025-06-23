import { ICaptureRepository } from "../repository/ICaptureRepository";
import { ZodHttpClient } from "./ZodHttpClient";
import { CaptureCompleteDto, CaptureCompleteDtoSchema, PagingResultCaptureSchema } from "@/shared/scheme/CaptureDtoSchema";
import { CaptureMapper } from "@/shared/mappers/CaptureMapper";
import Capture from "@/model/domain/Capture";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { FilterPredicate } from "@/shared/FilterPredicate";
import { IMapper } from "@/shared/mappers/IMapper";
import Specie from "@/model/domain/Specie";
import Location from "@/model/domain/Location";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export class CapturesClient implements ICaptureRepository {
    private readonly mapper: IMapper<CaptureCompleteDto, Capture>;

    constructor(
        private httpClient: ZodHttpClient,
        private baseUrl: string = '/FloraFaunaGo_API/capture',
        mapper: IMapper<CaptureCompleteDto, Capture> = new CaptureMapper()
    ) {
        this.mapper = mapper;
    }

    async create(capture: Capture): Promise<void> {
        throw new Error("Method not implemented - use addSpecieToUser instead");
    }

    async update(id: string, capture: Capture): Promise<void> {
        throw new Error("Method not implemented - captures are not updated");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented - captures cannot be deleted");
    }

    async getById(id: string): Promise<Capture> {
        const result = await this.httpClient.getValidated(
            `${this.baseUrl}/${id}`,
            CaptureCompleteDtoSchema
        );

        if (!result.success) {
            throw result.error;
        }
        const photoString = `data:image/jpeg;base64,${result.data.capture.photo}`
        return this.mapper.toDomain({
            ...result.data,
            capture:{
                ...result.data.capture,
                photo:photoString,
            }
        });
    }

    async getAll(request: PagedRequest): Promise<PagingResult<Capture>> {
        const result = await this.httpClient.getValidated(
            this.baseUrl,
            PagingResultCaptureSchema,
            undefined,
            { index: request.index, count: request.count }
        );

        if (!result.success) {
            throw result.error;
        }

        const mappedCaptures = this.mapper.toDomains(result.data.items);

        return {
            items: mappedCaptures,
            index: result.data.index,
            count: result.data.count,
            total: result.data.total
        };
    }

    async addSpecieToUser(userId: string, specie: Specie, userLocation: Location, capturedImageUri: string): Promise<void> {
        const endpoint = `${this.baseUrl}/idUser=${userId}&idEspece=${specie.id}`;
         // Remove data:image prefix if present (API expects clean base64)
        // const cleanBase64 = capturedImageUri.startsWith('data:') 
        //     ? capturedImageUri.split(',')[1] 
        //     : capturedImageUri;


            const cleanBase64 = await FileSystem.readAsStringAsync(capturedImageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const imageUri = `data:image/jpeg;base64,${cleanBase64}`;

            const compressedImage = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ resize: { width: 300, height: 300 } }],
                { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            );

        console.log("Captured image URI:", specie.name);
        console.log("Clean base64 image:", cleanBase64.slice(0, 100));
        const body = {
            photo: compressedImage.base64, // Use compressed image base64
            localisationNormalDto: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                altitude: userLocation.altitude,
                exactitude: 1,
            },
            shiny: false // Default value
        };

        const result = await this.httpClient.post(endpoint, body);
        

        if (!result.success) {
            throw new Error(`Failed to add specie to user: HTTP ${result.error}: ${result.error.message}`);
        }
    }

    async getCaptureByUserId(userId: string): Promise<PagingResult<Capture>> {
        const endpoint = `${this.baseUrl}/idUser=${userId}`;
        
        const result = await this.httpClient.getValidated(
            endpoint,
            PagingResultCaptureSchema
        );

        if (!result.success) {
            throw result.error;
        }

        const mappedCaptures = this.mapper.toDomains(result.data.items);

        return {
            items: mappedCaptures,
            index: result.data.index,
            count: result.data.count,
            total: result.data.total
        };
    }

    async count(filter: FilterPredicate<Capture>): Promise<number> {
        throw new Error("Method not implemented");
    }
}