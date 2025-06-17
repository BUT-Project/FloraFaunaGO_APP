import Location from "@/model/domain/Location";
import { PagedRequest } from "@/shared/PagedRequest";
import { PagingResult } from "@/shared/PagingResult";
import { Success,Family,Specie,User } from "@/model/domain";

export interface IAppFacadeService {
    // Authentication operations
    login(email: string, password: string): Promise<User>;
    register(email: string, password: string, username?: string): Promise<User>;
    logout(): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    getCurrentUser(): Promise<User | null>;

    // User management operations
    getUserById(id: string): Promise<User | null>;
    updateUser(id: string, updatedUser: User): Promise<void>;

    // Species operations
    addSpecieToUser(userId: string, specie: Specie, location: Location, imageUri: string): Promise<void>;
    getSpeciesByFamily(specieId:string, family: Family, request: PagedRequest): Promise<PagingResult<Specie>>;
    getAllSpecies(request: PagedRequest): Promise<PagingResult<Specie>>;

    // Success operations
    getUserSuccesses(userId: string, request: PagedRequest): Promise<PagingResult<Success>>;
}