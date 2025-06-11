import {create} from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import { devtools } from 'zustand/middleware';
import { toast } from '@backpackapp-io/react-native-toast';
import { SuccessStateCompleteItem } from '@/shared/scheme/SuccessStateNormalDtoSchema';
import { Success } from '@/model/domain/Success';
import { SuccessCompletMapper } from '@/shared/mappers/SuccessCompletMapper';

export interface SuccessState {
    updateSuccess(successId: string): void
    isVisibile: boolean
    message: string
    setisVisible: (isVisible: boolean) => void
    setMessage: (message: string) => void   
    //successToDisplay : Set<any> 
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
            var sucessStateRepo = StubData.getInstance().successStateRepository;
            var mapper = new SuccessCompletMapper();

            var sucess = await sucessRepo?.getById(successId);
            if(sucess !== undefined) {
                sucess.actualVal += 1
            // je vérifie les résultat du update si c'est completed alors 
            sucessRepo?.update(successId,sucess);
            if (sucessStateRepo !== undefined) {
                const dto = mapper.toDto(sucess);
                sucessStateRepo.update(successId, dto);
            }
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
