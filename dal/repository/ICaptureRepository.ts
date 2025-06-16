import {GenericRepository} from "@/dal/repository/IGenericRepository";
import Capture from "@/model/domain/Capture";
import Specie from "@/model/domain/Specie";

import Location from "@/model/domain/Location";

export interface ICaptureRepository extends GenericRepository<Capture> {
    addSpecieToUser(userId: string, specie: Specie, userLocation: Location, capturedImageUri: string): Promise<void>;
}

