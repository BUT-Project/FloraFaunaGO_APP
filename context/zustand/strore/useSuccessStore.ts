import {create} from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import { devtools } from 'zustand/middleware';
import { Success } from '@/model/domain/Success';
import SuccessPopup from '@/components/animation/sucess/SucessPopup';
import { useEffect } from 'react';
export interface SuccessState {
    updateSuccess(successId: string): void
    isVisibile: boolean
    message: string
    setisVisible: (isVisible: boolean) => void
    setMessage: (message: string) => void
    
}

const initialState = {
    isVisibile: false,
    message: "",
};



export const SuccessStore = create<SuccessState>()(
    devtools(
        (set, get) => ({
            ...initialState,

            setisVisible: (isVisible: boolean) => {
                set({isVisibile: isVisible
                })
            },

            setMessage: (message: string) => {
                    set({ message: message });
    },
    
    updateSuccess: async (successId: string) => {
        try {
            var sucess = await StubData.getInstance().successRepository?.getById(successId)
            var stub = StubData.getInstance()
            if(sucess !== undefined) {
                sucess.actualVal += 1
            stub.successRepository?.update(successId,sucess);
            get().setMessage(sucess.nom+ " completed ! 🏆")
            get().setisVisible(true)
            } 
        }
        catch (error) {
            console.error(error)
        }
 }
    
})));
