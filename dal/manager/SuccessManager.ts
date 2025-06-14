import {SuccessType} from "@/model/domain/SuccessType";
import {ISuccessStateRepository} from "../repository/ISuccessStateRepository";
import {ISuccessRepository} from "../repository/ISuccessRepository";
import {IDataManager} from "../IDataManager";
import {SuccessStore} from "@/context/zustand/store/useSuccessStore";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Diet} from "@/model/domain/Diet";
import {Family} from "@/model/domain/Family";
import {SuccessStateCompleteItem} from "@/shared/scheme/SuccessStateNormalDtoSchema";
import {Success} from "@/model/domain/Success";
import StubData from "../StubLib/StubData";
import {SuccessCompletMapper} from "@/shared/mappers/SuccessCompletMapper";
import {PagedRequest} from "@/shared/PagedRequest";

interface TestSuccessParams {
    name: string;
    spec?: { class?: string; kingdom?: string; diet?: string; family?: string };
    cl?: string;
    kg?: string;
    dt?: string;
    fm?: string;
}

export class SuccessManager extends IDataManager {
    private static instance: SuccessManager;

    constructor(private repo: ISuccessRepository, private repostate?: ISuccessStateRepository, private readonly useStub = false) {
        super();
        this.successRepository = repo;
        this.successStateRepository = repostate;

        if (this.successStateRepository) {
            this.useStub = false
        } else {
            this.useStub = true
        }
    }

    static getInstance(): SuccessManager {
        if (!SuccessManager.instance) {

            SuccessManager.instance = new SuccessManager(StubData.getInstance().successRepository!, StubData.getInstance().successStateRepository);
        }
        return SuccessManager.instance;
    }


    async getAllSuccessMapped(pageRequest: PagedRequest): Promise<Success[]> {
        if (this.useStub) {
            console.log("test")
            const allSuccess = await this.successRepository?.getAll(pageRequest);
            return allSuccess?.items ?? [];
        } else {
            // En mode API, utiliser successStateRepository
            if (!this.successStateRepository) {
                console.warn("successStateRepository non défini en mode API");
                return [];
            }
            const stateResult = await this.successStateRepository.getAll(pageRequest);
            if (!stateResult?.items) return [];

            const mapper = new SuccessCompletMapper();
            return stateResult.items.map(item => {
                return mapper.fromSeparateDtos(item.success, item.state.percentSucces);

            })
        }
    }


    async updateSuccess(successEvent: string): Promise<Success | undefined> {
        const all = await this.repo.getAll({index: 0, count: 100});
        const success = all.items.find(s => s.id === successEvent);
        if (!success) return;

        success.actualVal += 1;

        if (this.useStub) {
            // Juste mise à jour en mémoire
            await this.repo.update(success.id, success);
            return success;
        } else {
            // Met à jour dans l’API + dans le state
            const states = await this.repostate?.getAll({index: 0, count: 100});
            if (!states) {
                console.warn("Aucun état trouvé pour", successEvent);
                return success;
            }
            const state = states.items.find(s => s.success.evenement === successEvent);
            if (!state) {
                console.warn("État non trouvé pour", successEvent);
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

            await this.repostate?.update(state.state.id, newItem);

            return success
        }
    }


    async testSuccess(params: TestSuccessParams): Promise<void> {
        const allsuccess = await this.repo.getAll({index: 0, count: 100});
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

        await SuccessStore.getState().updateSuccess(params.name);

    }

    async executeSuccessQueue(queue: TestSuccessParams[]): Promise<void> {
        queue.forEach((params, i) => {
            setTimeout(() => {
                console.log(`Executing success test for: ${params.name}`);
                this.testSuccess(params);
            }, i * 5000);
        });
    }

    async processSuccessByType(successType: SuccessType, spec: any): Promise<any> {
        const all = await this.repo.getAll({index: 0, count: 100});
        const filtered = all.items.filter(s => s.type === SuccessType.PHOTO || s.type === successType);

        console.log(`Processing ${filtered.length} successes of type ${successType}`);
        const queue: TestSuccessParams[] = [];

        for (const success of filtered) {
            const params: TestSuccessParams = {name: success.id, spec};

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

        return spec;
    }
}
