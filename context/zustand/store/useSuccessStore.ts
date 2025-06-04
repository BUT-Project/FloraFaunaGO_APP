import {create} from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import { devtools } from 'zustand/middleware';
import { toast } from '@backpackapp-io/react-native-toast';

export interface SuccessState {
    updateSuccess(successId: string): void
    isVisibile: boolean
    message: string
    setisVisible: (isVisible: boolean) => void
    setMessage: (message: string) => void   
    successToDisplay : Set<any> 
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
            var sucessRepo = StubData.getInstance().successRepository;
            var sucess = await sucessRepo?.getById(successId);
            if(sucess !== undefined && sucess !== null && sucess.actualVal < sucess.objectif) {
                sucess.actualVal += 1
            sucessRepo?.update(successId,sucess);
            if(sucess.actualVal >= sucess.objectif) {
            toast.success(sucess.nom+ " completed ! 🏆");  
            }          
        } 
        }
        catch (error) {
            console.error(error)
        }
 }
    
})));
