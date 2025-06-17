import { IDataManager } from "@/dal/IDataManager";
import { IAppFacadeService } from "./IAppFacadeService";
import User from "@/model/domain/User";
import Specie from "@/model/domain/Specie";
import Location from "@/model/domain/Location";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { Success } from "@/model/domain/Success";
import { SuccessType } from "@/model/domain/SuccessType";
import { SuccessManager } from "@/dal/manager/SuccessManager";
import WebApiClient from "@/dal/network/WebApiClient";

export class AppFacadeService implements IAppFacadeService {
    private static instance: AppFacadeService | null = null;
    public readonly dataManager: IDataManager;

    private constructor() {
        this.dataManager = new WebApiClient();
    }

    static getInstance(): AppFacadeService {
        if (!AppFacadeService.instance) {
            AppFacadeService.instance = new AppFacadeService();
        }
        return AppFacadeService.instance;
    }

    // Authentication operations
    async login(email: string, password: string): Promise<User> {
        console.log('🏢 AppFacadeService.login called with mail:', email);
        
        const { authService } = this.dataManager;
        if (!authService) {
            console.error('❌ Authentication service not available in dataManager');
            throw new Error("Authentication service not available");
        }

        console.log('🔑 Calling authService.login...');
        console.log('🔍 AuthService type:', authService.constructor.name);
        
        try {
            const user = await authService.login(email, password);
            if (!user) {
                console.error('❌ AuthService returned null/undefined user');
                throw new Error("Invalid credentials");
            }

            console.log('✅ AppFacadeService.login successful, returning user:', { id: user.id, username: user.username });
            return user;
        } catch (error) {
            console.error('❌ AppFacadeService.login - authService.login threw error:', error);
            console.error('❌ Error details:', {
                type: typeof error,
                constructor: error?.constructor?.name,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : 'No stack'
            });
            throw error;
        }
    }
    async resetPassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
        const { authService } = this.dataManager;
    
        if (!authService) {
            throw new Error("Authentication service not available");    
        }
        await authService.resetPassword(email, oldPassword, newPassword);
        console.log('🔑 Password reset successful for email:', email);
    }

    async register(email: string, password: string, username?: string): Promise<User> {
        const { authService } = this.dataManager;
        if (!authService) {
            throw new Error("Authentication service not available");
        }

        const user = await authService.register(email, password, username ?? email);
        if (!user) {
            throw new Error("Registration failed");
        }

        return user;
    }

    async logout(): Promise<void> {
        const { authService } = this.dataManager;
        if (!authService) {
            throw new Error("Authentication service not available");
        }

        await authService.logout();
    }

    async isAuthenticated(): Promise<boolean> {
        const { authService } = this.dataManager;
        if (!authService) {
            return false;
        }
        return await authService.isAuthenticated();
    }

    async getCurrentUser(): Promise<User | null> {
        const { authService } = this.dataManager;
        if (!authService) {
            return null;
        }
        return await authService.getUser();
    }

    // User management operations
    async getUserById(id: string): Promise<User | null> {
        const { userRepository } = this.dataManager;
        if (!userRepository) {
            throw new Error("User repository not available");
        }
        return await userRepository.getById(id);
    }

    async updateUser(id: string, updatedUser: User): Promise<void> {
        const { userRepository } = this.dataManager;
        if (!userRepository) {
            console.error("❌ User repository not available in dataManager");
            throw new Error("User repository not available");
        }
        console.log("pass Facade")
        await userRepository.update(id, updatedUser);
    }

    // Species operations
    async addSpecieToUser(userId: string, specie: Specie, location: Location, imageUri: string): Promise<void> {
        if (!imageUri) {
            throw new Error('No image selected for species capture');
        }

        const { captureRepository, successRepository, successStateRepository } = this.dataManager;
        if (!captureRepository || !successRepository || !successStateRepository) {
            throw new Error("Capture repository not available");
        }

        // Process success
        const successManager = new SuccessManager(successRepository, successStateRepository);
        await successManager.processSuccessByType(SuccessType.CAPTURE, specie);


        await captureRepository.addSpecieToUser(userId, specie, location, imageUri);
    }

    async getSpeciesByFamily(familyId: string, request: PagedRequest): Promise<PagingResult<Specie>> {
        const { speciesRepository } = this.dataManager;
        if (!speciesRepository) {
            throw new Error("Species repository not available");
        }
        return await speciesRepository.getRelatedSpeciesByFamily(familyId, request);
    }

    async getAllSpecies(request: PagedRequest): Promise<PagingResult<Specie>> {
        const { speciesRepository } = this.dataManager;
        if (!speciesRepository) {
            throw new Error("Species repository not available");
        }
        return await speciesRepository.getAll(request);
    }

    // Success operations
    async getUserSuccesses(userId: string, request: PagedRequest): Promise<PagingResult<Success>> {
        const { successRepository } = this.dataManager;
        if (!successRepository) {
            throw new Error("Success repository not available");
        }
        return await successRepository.getAll(request);
    }
}