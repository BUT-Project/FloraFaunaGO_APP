import { SuccessType } from "@/model/domain/SuccessType";
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
    constructor(private repo: ISuccessRepository) {}
  
    async testSuccess(params: TestSuccessParams): Promise<void> {
      const success = await this.repo.getById(params.name);
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
  
      if (success.objectif !== success.actualVal) {
        await SuccessStore.getState().updateSuccess(params.name);
      }
    }
  
    async executeSuccessQueue(queue: TestSuccessParams[]): Promise<void> {
      queue.forEach((params, i) => {
        setTimeout(() => {
          this.testSuccess(params);
        }, i * 5000);
      });
    }
  
    async processSuccessByType(successType: SuccessType, spec: any): Promise<any> {
      const all = await this.repo.getAll({ index: 1, count: 100 });
      const filtered1 = all.items.filter(s => s.type === successType);
      const filtered = filtered1.filter(s => s.event.includes(spec.kingdom));
      filtered.push(...filtered1.filter(s => s.type === SuccessType.PHOTO));
      if (filtered.length === 0) return ;
      const queue: TestSuccessParams[] = [];
      const seen = new Set<string>();
  
      for (const success of filtered) {
        const key = `${success.event}-${spec.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
  
        const params: TestSuccessParams = { name: success.event, spec };
        console.log("spec",spec)

        console.log("event",success.event)
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
  
      await this.executeSuccessQueue(queue);
  
      return spec;
    }
  }
  