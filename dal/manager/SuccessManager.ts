import { SuccessType } from "@/model/domain/SuccessType";
import { ISuccessStateRepository } from "../repository/ISuccessStateRepository";
import { ISuccessRepository } from "../repository/ISuccessRepository";

import { SuccessStore } from "@/context/zustand/store/useSuccessStore";
import { Kingdom } from "@/model/domain/Kingdom";
import { Class } from "@/model/domain/Class";
import { Diet } from "@/model/domain/Diet";
import { Family } from "@/model/domain/Family";

interface TestSuccessParams {
    name: string;
    spec?: { class?: string; kingdom?: string; diet?: string; family?: string };
    cl?: string;
    kg?: string;
    dt?: string;
    fm?: string;
}

export class SuccessManager {
    constructor(private repo: ISuccessRepository, private repostate: ISuccessStateRepository) {}
  
    async testSuccess(params: TestSuccessParams): Promise<void> {
      console.log(`Testing success for: ${params.name}`);
      const success = await this.repo.getById(params.name);
      const state = await this.repostate.getAll(params.name)
      console.log(`Testing success: ${success}`);
      if (!success || !params.spec) return;
  
      const { cl, kg, dt, fm, spec } = params;
  
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
        await SuccessStore.getState().updateSuccess(params.name);
      }
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
      const all = await this.repo.getAll({ index: 0, count: 100 });
      const filtered = all.items.filter(s => s.type === SuccessType.PHOTO || s.type === successType);
  
      console.log(`Processing ${filtered.length} successes of type ${successType}`);
      const queue: TestSuccessParams[] = [];

      for (const success of filtered) {
        const params: TestSuccessParams = { name: success.event, spec };

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
  