import {GenericRepository} from "@/model/service/IGenericRepository";
import Capture from "@/model/domain/Capture";
import {Family} from "@/model/domain/Family";
import {PagingResult} from "@/shared/PagingResult";

export interface ICaptureRepository extends GenericRepository<Capture> {
    getByFamily(family:Family, page: number, pageSize: number) : Promise<PagingResult<Capture>>;
}

