import {create} from 'zustand';
import StubData from "@/dal/StubLib/StubData";
import { devtools } from 'zustand/middleware';
import { toast } from '@backpackapp-io/react-native-toast';
import { SuccessStateCompleteItem } from '@/shared/scheme/SuccessStateNormalDtoSchema';
import { Success } from '@/model/domain/Success';
import { SuccessCompletMapper } from '@/shared/mappers/SuccessCompletMapper';
import { SuccessManager } from '@/dal/manager/SuccessManager';
export interface SuccessState {
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
            }
        })));




