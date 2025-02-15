import Specie from "@/model/domain/Specie";
import {Class} from "@/model/domain/Class";
import {Kingdom} from "@/model/domain/Kingdom";
import {Diet} from "@/model/domain/Diet";
import {Family} from "@/model/domain/Family";

export interface TestSuccesParams {
    name: string;
    spec: Specie;
    cl?: Class;
    kg?: Kingdom;
    dt?: Diet;
    fm?: Family;
}