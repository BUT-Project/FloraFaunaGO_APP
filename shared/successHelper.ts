

import { SuccessStore } from '@/context/zustand/store/useSuccessStore';
import StubData from '@/dal/StubLib/StubData';
import { Class } from '@/model/domain/Class';
import { Diet } from '@/model/domain/Diet';
import { Family } from '@/model/domain/Family';
import { Kingdom } from '@/model/domain/Kingdom';
import { SuccessType } from '@/model/domain/SuccessType';

const { successRepository } = StubData.getInstance();

export interface TestSuccessParams {
    name: string;
    spec?: { class?: string; kingdom?: string; diet?: string; family?: string };
    cl?: string;
    kg?: string;
    dt?: string;
    fm?: string;
}

/**
 * Vérifie et met à jour un succès si les critères sont remplis
 */
const globallyTestedSuccesses = new Set<string>();

export const TestSuccess = async ({ name, spec, cl, kg, dt, fm }: TestSuccessParams) => {
    if (!successRepository || !spec) return;


    const success = await successRepository.getById(name);
    if (!success) return;

    if (
        (cl && cl !== spec.class) ||
        (kg && kg !== spec.kingdom) ||
        (dt && dt !== spec.diet) ||
        (fm && fm !== spec.family)
    ) {
        return; // Si une condition est fausse, on ne met pas à jour le succès
    }

    if (success.objectif !== success.actualVal) {
        await SuccessStore.getState().updateSuccess(name);
    }
};

/**
 * Récupère et traite les succès en fonction du type spécifié
 */
export const processSuccessByType = async (successType: SuccessType, spec: any) => {
    if (!successRepository) return;

    const allSuccess = await successRepository.getAll({ index: 1, count: 100 });

    // Filtrer les succès par type (ex: CAPTURE, PHOTO...)
    const filteredSuccesses = allSuccess?.items.filter(success => success.type === successType);

    const successQueue: TestSuccessParams[] = [];
    const seen = new Set<string>();

    for (const success of filteredSuccesses ?? []) {

        const key = `${success.event}-${spec.id}`;
        if (seen.has(key)) continue; // ← déjà traité
        seen.add(key);
        const params: TestSuccessParams = { name: success.event, spec };

        const kingdoms = Object.values(Kingdom);
        const classes = Object.values(Class);
        const diets = Object.values(Diet);
        const families = Object.values(Family);

        for (const kingdom of kingdoms) {
            if (success.event.includes(kingdom)) {
                params.kg = kingdom;
                break;
            }
        }

        for (const cl of classes) {
            if (success.event.includes(cl)) {
                params.cl = cl;
                break;
            }
        }

        for (const diet of diets) {
            if (success.event.includes(diet)) {
                params.dt = diet;
                break;
            }
        }

        for (const family of families) {
            if (success.event.includes(family)) {
                params.fm = family;
                break;
            }
        }

        successQueue.push(params);
    }

    executeSuccessQueue(successQueue);

    return spec;
};


/**
 * Exécute chaque succès avec un délai sans bloquer l’UI
 */
const executeSuccessQueue = (queue: TestSuccessParams[]) => {
    queue.forEach((params, index) => {
        setTimeout(() => {
            TestSuccess(params);
        }, index * 5000);

        
    });
};