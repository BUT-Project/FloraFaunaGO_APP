import {SuccessType} from "@/model/domain/SuccessType";
import {ISuccessStateRepository} from "../repository/ISuccessStateRepository";
import {ISuccessRepository} from "../repository/ISuccessRepository";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Diet} from "@/model/domain/Diet";
import {Family} from "@/model/domain/Family";
import Specie from "@/model/domain/Specie";

import {SuccessStateCompleteItem} from "@/shared/scheme/SuccessStateNormalDtoSchema";
import {Success} from "@/model/domain/Success";
import {SuccessCompletMapper} from "@/shared/mappers/SuccessCompletMapper";
import {PagedRequest} from "@/shared/PagedRequest";
import { FilterPredicate } from "@/shared/FilterPredicate";
import { PagingResult } from "@/shared/PagingResult";
import {toast} from "@backpackapp-io/react-native-toast";

interface TestSuccessParams {
    name: string;
    spec?: { class?: string; kingdom?: string; diet?: string; family?: string };
    cl?: string;
    kg?: string;
    dt?: string;
    fm?: string;
}

export class SuccessManager implements ISuccessRepository {
    constructor(private successRepository: ISuccessRepository, private successStateRepository?: ISuccessStateRepository, private readonly useStub = false) {
        if (this.successStateRepository) {
            this.useStub = false
        } else {
            this.useStub = true
        }
    }

    isCompleted(suc: Success): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }
    create(item: Success): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(id: any, item: Success): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getById(id: any): Promise<Success> {
        throw new Error("Method not implemented.");
    }
    async getAll(request: PagedRequest): Promise<PagingResult<Success>> {
        if (this.useStub) {
            console.log("test : useStub is true, using stub data in SuccessManager");
            return await this.getAll(request);
        } else {
            // En mode API, utiliser successStateRepository
            if (!this.successStateRepository) {
                console.warn("successStateRepository (aka repostate) non défini en mode API");
                return {
                    count: 0,
                    index: request.index,
                    total: 0,
                    items: []
                };
            }
            const stateResult = await this.successStateRepository.getAll(request);
            if (!stateResult?.items)
                return {
                    count: 0,
                    index: request.index,
                    total: 0,
                    items: []
                };

            const mapper = new SuccessCompletMapper();
            const mappedSucces = stateResult.items.map(item => {
                return mapper.fromSeparateDtos(item.success, item.state.percentSucces);
            })

            return {
                count: stateResult.count,
                index: stateResult.index,
                total: stateResult.total,
                items: mappedSucces
            };
        }
    }
    count(filter: FilterPredicate<Success>): Promise<number> {
        throw new Error("Method not implemented.");
    }

    // ok quelle est l'utilité de cette méthode ? car elle dit prendre un event en string alors que c'est un id
    // [DAVE] : Cette méthode est utilisée pour mettre à jour le succès en fonction de l'événement passé en paramètre.
    // on devrait peut-être renommer le paramètre pour plus de clarté.
    private async updateSuccess(successId: string): Promise<Success | undefined> {
        const all = await this.successRepository.getAll({index: 0, count: 100});
        const success = all.items.find(s => s.id === successId);
        if (!success) return;

        success.actualVal += 1;

        if (this.useStub) {
            // Juste mise à jour en mémoire
            await this.successRepository.update(success.id, success);
            return success;
        } else {
            // Met à jour dans l’API + dans le state
            const states = await this.successStateRepository?.getAll({index: 0, count: 100});
            if (!states) {
                console.warn("Aucun état trouvé pour", successId);
                return success;
            }
            console.log("dave staets",states.items);
            const state = states.items.find(s => s.success.id === successId);
            if (!state) {
                console.warn("État non trouvé pour", successId);
                return success;
            }

            //await this.repo.update(success.id, success);

            const newItem: SuccessStateCompleteItem = {
                ...state,
                state: {
                    ...state.state,
                    percentSucces: state.state.percentSucces + 1,
                    isSucces: success.actualVal >= success.objectif
                }
            };

            await this.successStateRepository?.update(state.state.id, newItem);
            if(success.actualVal >= success.objectif) {
                toast.success(success.nom+ " completed ! 🏆");
            }
            return success
        }
    }


    private async testSuccess(params: TestSuccessParams): Promise<void> {
        const allsuccess = await this.successRepository.getAll({index: 0, count: 100});
        const success = allsuccess.items.find(s => s.id == params.name);
        //const success = await this.repo.getById(params.name);
        //const state = await this.repostate.getById(params.name)
        //console.log(`Success state: ${state}`);
        if (!success || !params.spec) return;

        const {cl, kg, dt, fm, spec} = params;

        if (
            (cl && cl !== spec.class) ||
            (kg && kg !== spec.kingdom) ||
            (dt && dt !== spec.diet) ||
            (fm && fm !== spec.family)
        ) {
            return;
        }


        if (success.objectif <= success.actualVal) {
            console.log(`Success already completed: ${success.event}`);
            return
        }

        await this.updateSuccess(params.name);

    }

    private async executeSuccessQueue(queue: TestSuccessParams[]): Promise<void> {
        queue.forEach((params, i) => {
            setTimeout(() => {
                console.log(`Executing success test for: ${params.name}`);
                this.testSuccess(params);
            }, i * 5000);
        });
    }

    async processSuccessByType(successType: SuccessType, specie: Specie): Promise<void> {
        const all = await this.successRepository.getAll({index: 0, count: 100});
        const filtered = all.items.filter(s => s.type === SuccessType.PHOTO || s.type === successType);

        console.log(`Processing ${filtered.length} successes of type ${successType.toString()}`);
        const queue: TestSuccessParams[] = [];

        for (const success of filtered) {
            const params: TestSuccessParams = {name: success.id, spec: specie};

            for (const value of Object.values(Kingdom)) {
                if (success.event.includes(value)) params.kg = value;
            }

            for (const value of Object.values(Class)) {
                if (success.event.includes(value)) params.cl = value;
            }

            for (const value of Object.values(Diet)) {
                if (success.event.includes(value)) params.dt = value;
            }

            for (const value of Object.values(Family)) {
                if (success.event.includes(value)) params.fm = value;
            }

            queue.push(params);
        }
        console.log(`Queue length: ${queue.length}`);
        await this.executeSuccessQueue(queue);

        return;
    }
}
