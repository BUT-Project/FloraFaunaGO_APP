import {create} from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import { Success } from '@/model/domain/Success';

export interface SuccessState {
    updateSuccess(successId: string): void
    
}

export const SuccessStore = create<SuccessState>((get,set) => ({
    updateSuccess: async (successId: string) => {
        var sucess = await StubData.getInstance().successRepository?.getById(successId)
        var stub = StubData.getInstance()
        if(sucess !== undefined) {
            sucess.actualVal += 1
        stub.successRepository?.update(successId,sucess)
    }
    },


}));