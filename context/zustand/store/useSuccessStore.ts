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
    
    updateSuccess: async (successEvent: string) => {
        try {
            var sucessRepo = StubData.getInstance().successRepository;
            var sucessStateRepo = StubData.getInstance().successStateRepository;
            var userRepository = StubData.getInstance().userRepository;
            var sucessCompletMapper = new SuccessCompletMapper();
            var allSuccess = await sucessRepo?.getAll({index: 0, count: 100});
            var sucess = allSuccess?.items.find(s => s.event === successEvent);
            var states = await sucessStateRepo?.getAll({index: 0, count: 100});
            var state = states?.items.find(s => s.success.evenement == successEvent);
            if(sucess !== undefined) {
                sucess.actualVal += 1
            // je vérifie les résultat du update si c'est completed alors 
            //sucessRepo?.update(successId,sucess);
            if (sucessStateRepo !== undefined) {
                const successStateCompleteItem: SuccessStateCompleteItem = {
                    state: {
                        id: state!.state.id,
                        percentSucces: state!.state.percentSucces+1,
                        isSucces: false
                    },
                    success: sucessCompletMapper.toDto(sucess).success,
                    user: null
                };
                console.log("Success state data:", successStateCompleteItem);
                await sucessStateRepo.update(state!.state.id, successStateCompleteItem);
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
