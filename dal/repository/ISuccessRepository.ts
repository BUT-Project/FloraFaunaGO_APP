import {GenericRepository} from "@/dal/repository/IGenericRepository";
import {Success} from "@/model/domain/Success";
import { SuccessType } from "@/model/domain/SuccessType";

export interface TestSuccessParams {
    name: string;
    spec?: { class?: string; kingdom?: string; diet?: string; family?: string };
    cl?: string;
    kg?: string;
    dt?: string;
    fm?: string;
}

export interface ISuccessRepository extends GenericRepository<Success> {
    TestSuccess: ({ name, spec, cl, kg, dt, fm }: TestSuccessParams) => Promise<void>
    processSuccessByType: (successType: SuccessType, spec: any) => Promise<any>
    executeSuccessQueue: (queue: TestSuccessParams[]) => void
}


