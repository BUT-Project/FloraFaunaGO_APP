import {GenericRepository} from "@/dal/repository/IGenericRepository";
import Capture from "@/model/domain/Capture";
import {Family} from "@/model/domain/Family";
import {PagingResult} from "@/shared/PagingResult";
import Specie from "@/model/domain/Specie";

import Location from "@/model/domain/Location";

export interface ICaptureRepository extends GenericRepository<Capture> {
    getByFamily(family:Family, page: number, pageSize: number, selfId?: string) : Promise<PagingResult<Capture>>;
    addSpecieToUser(userId: string, specie: Specie, userLocation: Location, capturedImageUri: string): Promise<void>;
}

